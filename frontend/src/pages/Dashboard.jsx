import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [noteText, setNoteText] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (error) {
      alert("Please login first");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/leads/${id}/status`, { status });
    fetchLeads();
  };

  const addNote = async (id) => {
    if (!noteText[id]?.trim()) return;

    await API.put(`/leads/${id}/notes`, {
      text: noteText[id],
    });

    setNoteText({
      ...noteText,
      [id]: "",
    });

    fetchLeads();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(search.toLowerCase()) ||
      lead.source.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const newCount = leads.filter((lead) => lead.status === "new").length;
  const contactedCount = leads.filter((lead) => lead.status === "contacted").length;
  const convertedCount = leads.filter((lead) => lead.status === "converted").length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Mini CRM Dashboard</h2>
          <p>Manage client leads, follow-ups, and conversions.</p>
        </div>

        <div className="header-actions">
          <button onClick={() => navigate("/submit-lead")}>Add Lead</button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>{leads.length}</h3>
          <p>Total Leads</p>
        </div>

        <div className="stat-card">
          <h3>{newCount}</h3>
          <p>New</p>
        </div>

        <div className="stat-card">
          <h3>{contactedCount}</h3>
          <p>Contacted</p>
        </div>

        <div className="stat-card">
          <h3>{convertedCount}</h3>
          <p>Converted</p>
        </div>
      </div>

      <div className="filters">
        <input
          placeholder="Search by name, email, phone, source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div className="lead-list">
        {filteredLeads.length === 0 && (
          <div className="empty-card">No leads found</div>
        )}

        {filteredLeads.map((lead) => (
          <div className="lead-card" key={lead._id}>
            <div className="lead-top">
              <h3>{lead.name}</h3>
              <span className={`badge ${lead.status}`}>{lead.status}</span>
            </div>

            <p><b>Email:</b> {lead.email}</p>
            <p><b>Phone:</b> {lead.phone || "Not provided"}</p>
            <p><b>Source:</b> {lead.source}</p>
            <p>
              <b>Created:</b>{" "}
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>

            <select
              value={lead.status}
              onChange={(e) => updateStatus(lead._id, e.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>

            <h4>Follow-up Notes</h4>

            {lead.notes?.length === 0 && <p className="muted">No notes yet</p>}

            {lead.notes?.map((note, index) => (
              <p key={index} className="note">
                {note.text}
              </p>
            ))}

            <input
              placeholder="Add follow-up note"
              value={noteText[lead._id] || ""}
              onChange={(e) =>
                setNoteText({
                  ...noteText,
                  [lead._id]: e.target.value,
                })
              }
            />

            <button onClick={() => addNote(lead._id)}>
              Add Note
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
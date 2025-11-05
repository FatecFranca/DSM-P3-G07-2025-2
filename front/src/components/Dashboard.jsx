import React, { useState } from "react";

const Dashboard = ({ gym = [], onGymRemoved }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleRemoveGym = async (gymId) => {
    if (!gymId) {
      alert("Invalid gym id.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this gym?")) return;

    const token = localStorage.getItem("token");
    setDeletingId(gymId);

    try {
      const res = await fetch(`http://localhost:5000/gyms/${gymId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Failed to remove gym. ${text || res.statusText}`);
        setDeletingId(null);
        return;
      }

      onGymRemoved && onGymRemoved(gymId);
    } catch (err) {
      alert("Error removing gym.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Occupancy</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {gym.map((g, idx) => {
            const id = g._id || g.id || g._id?.toString() || idx;
            const occupancy = Number(g.occupancy || 0);
            const capacity = Number(g.capacity || 0) || 1;
            const percentage = ((occupancy / capacity) * 100).toFixed(1);
            const isHalfOrMore = occupancy >= capacity / 2;

            return (
              <tr key={id}>
                <td>
                  {g.name}
                </td>
                <td>{capacity}</td>
                <td>
                  <p
                    className={`dashboard-occupancy${
                      isHalfOrMore ? " dashboard-occupancy-full" : ""
                    }`}
                  >
                    {percentage}%
                  </p>
                </td>
                <td>
                  <button
                    className="dashboard-remove-gym"
                    type="button"
                    style={{ marginLeft: "1em" }}
                    onClick={() => handleRemoveGym(id)}
                    disabled={deletingId === id}
                  >
                    {deletingId === id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from "react";
import { Card, ProgressBar, Badge } from "react-bootstrap";
import axios from "axios";

function Gamification() {
  const userId = 1; // replace with logged-in user's ID
  const [user, setUser] = useState({});
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5000/api/gamification/${userId}`);
      setUser(res.data.user);
      setBadges(res.data.badges);
    };
    fetchData();
  }, []);

  const progress = user.xp ? (user.xp % 100) : 0;

  return (
    <div className="container my-4">
      <h2>Your Progress</h2>
      <Card className="mb-3 p-3">
        <h4>{user.username}</h4>
        <p>🔥 Streak: {user.streak_count} days</p>
        <ProgressBar now={progress} label={`${progress}/100 XP`} />
      </Card>

      <Card className="p-3">
        <h4>Badges</h4>
        {badges.map((badge, idx) => (
          <Badge key={idx} bg="primary" className="me-2">{badge.name}</Badge>
        ))}
      </Card>
    </div>
  );
}

export default Gamification;

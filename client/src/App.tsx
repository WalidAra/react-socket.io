/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000/");

export default function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [msgs, setMsgs] = useState<string[]>([]);
  const [msgValue, setMsgValue] = useState<string>("");
  const [ppl, setPpl] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [myID, setmyID] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("getID", (id: string) => {
      setmyID(id);
    });

    socket.on("users", (users: string[]) => {
      setPpl(users);
    });

    socket.on("privateMessage", (msg) => {
      setMsgs((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msgValue) {
      socket.emit("privateMessage", {
        senderId: myID,
        receiverId: userId,
        message: msgValue,
      });
      setMsgValue("");
    }
  };

  return (
    <div>
      <h1> my id is : {myID} </h1>

      {connected ? <div>Connected</div> : <div>not connected</div>}

      <hr />

      {msgs.length > 0 && msgs.map((msg) => <div key={msg}>{msg}</div>)}

      <form onSubmit={onSubmit}>
        <div> selected user bah tb3thlo message : {userId} </div>
        <input
          placeholder="message"
          value={msgValue}
          onChange={(e) => setMsgValue(e.target.value)}
        />
        {ppl.map((user) => {
          if (user !== myID) {
            return (
              <div onClick={() => setUserId(user)} key={user}>
                {user}
              </div>
            );
          }
        })}

        <button type="submit">send</button>
      </form>
    </div>
  );
}

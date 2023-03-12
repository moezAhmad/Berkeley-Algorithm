const io = require("socket.io")(3000);

// Function to calculate the average time difference
const calculateAverageTimeDifference = (timeDifferences) => {
  const sum = timeDifferences.reduce((acc, curr) => acc + curr, 0);
  return sum / timeDifferences.length;
};

// Function to calculate the synchronized time
const calculateSynchronizedTime = (clientTime, averageTimeDifference) => {
  return clientTime + averageTimeDifference;
};

io.on("connection", (socket) => {
  console.log("Client connected");

  // Get the current time from the server
  const getTime = () => {
    const time = new Date().getTime();
    socket.emit("time", time);
  };

  // Listen for client requests for the current time
  socket.on("getTime", getTime);

  // Listen for client time differences
  socket.on("timeDifference", (timeDifference) => {
    const clients = io.sockets.sockets;
    const clientIds = Object.keys(clients);
    const timeDifferences = [];

    // Calculate time differences from all clients
    clientIds.forEach((clientId) => {
      if (clientId !== socket.id) {
        const clientTimeDifference = clients[clientId].timeDifference;
        timeDifferences.push(clientTimeDifference);
      }
    });

    // Calculate average time difference
    const averageTimeDifference =
      calculateAverageTimeDifference(timeDifferences);

    // Calculate synchronized time
    const synchronizedTime = calculateSynchronizedTime(
      new Date().getTime(),
      averageTimeDifference
    );

    // Send synchronized time to all clients
    clientIds.forEach((clientId) => {
      const clientSocket = clients[clientId];
      clientSocket.emit("synchronizedTime", synchronizedTime);
    });
  });
});

const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");

// Function to calculate the time difference
const calculateTimeDifference = (serverTime, clientTime) => {
  return serverTime - clientTime;
};

// Function to print the synchronized time for all clients
const printSynchronizedTime = (synchronizedTime) => {
  console.log(
    `Synchronized time: ${new Date(synchronizedTime).toLocaleString()}`
  );
};

// Get the current time from the server and calculate the time difference
const getTime = () => {
  const startTime = new Date().getTime();
  socket.emit("getTime");
  socket.on("time", (serverTime) => {
    const endTime = new Date().getTime();
    const latency = (endTime - startTime) / 2;
    const clientTime = startTime + latency;
    const timeDifference = calculateTimeDifference(serverTime, clientTime);
    console.log(
      `Received time from server: ${new Date(serverTime).toLocaleString()}`
    );
    console.log(`Time difference: ${timeDifference} ms`);
    socket.timeDifference = timeDifference;
    socket.emit("timeDifference", timeDifference);
  });
};

// Listen for the synchronized time from the server
socket.on("synchronizedTime", printSynchronizedTime);

// Get the time from the server and calculate the time difference every 5 seconds
setInterval(getTime, 5000);

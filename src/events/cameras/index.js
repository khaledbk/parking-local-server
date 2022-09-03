export function eventsHandler(request, response, next) {
  let event = {
    date: new Date(),
    image: "",
    file: "",
    infraction: "",
  };
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(event)}\n\n`;

  response.write(data);

  request.on("close", () => {
    console.log(`Logged out ... Connection closed`);
    // clients = clients.filter((client) => client.id !== clientId);
  });
}

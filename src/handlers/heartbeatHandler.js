import os from "os";
import localIpAddress from "local-ip-address";

export const heartbeatHandler = (_req, res) => {
  const systemInfo = {
    status: "online",
    hostname: os.hostname(),
    host: localIpAddress(),
    type: os.type(),
    platform: os.platform(),
    arch: os.arch(),
    uptime: os.uptime(),
    loadavg: os.loadavg(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    os: os.version(),
    networkInterface: os.networkInterfaces(),
    userInfo: os.userInfo(),
    machine: os.platform(),
    process: {
      pid: process.pid,
      version: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    },
    version: "1.1.2",
  };
  res.status(200).json(systemInfo);
};

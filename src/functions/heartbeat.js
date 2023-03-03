import os from "os";
import process from "process";
import localIpAddress from "local-ip-address";

export const heartbeat = (req, res) => {
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
    machine: os.machine(),
    process: {
      pid: process.pid,
      version: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    },
    version: "0.0.1@alpha",
  };
  res.status(200).json(systemInfo);
};

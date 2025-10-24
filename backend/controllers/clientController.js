const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addClient = async (req, res) => {
    const client = await prisma.client.create({ data: req.body });

    // Increment gym occupancy
    const gym = await prisma.gym.findFirst({ where: { name: client.gymName } });
    if (gym) {
        await prisma.gym.update({
            where: { id: gym.id },
            data: { occupancy: gym.occupancy + 1 }
        });
    }
    res.status(201).json(client);
};

const checkoutClient = async (req, res) => {
    const { name, gymName } = req.body;
    const client = await prisma.client.findFirst({ where: { name, gymName } });
    if (!client) return res.status(404).json({ message: "Client not found" });

    await prisma.client.delete({ where: { id: client.id } });

    const gym = await prisma.gym.findFirst({ where: { name: gymName } });
    if (gym) {
        await prisma.gym.update({
            where: { id: gym.id },
            data: { occupancy: Math.max(0, gym.occupancy - 1) }
        });
    }
    res.status(200).json({ message: "Checked out" });
};

const getClients = async (req, res) => {
    const clients = await prisma.client.findMany();
    res.json(clients);
};

module.exports = { addClient, checkoutClient, getClients };
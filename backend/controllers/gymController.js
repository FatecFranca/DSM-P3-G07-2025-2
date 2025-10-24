const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createGym = async (req, res) => {
    const { name, address, phone, capacity } = req.body;
    try {
        const gym = await prisma.gym.create({
            data: { name, address, phone, capacity, occupancy: 0 }
        });
        res.status(201).json(gym);
    } catch (error) {
        res.status(500).json({ message: "Error creating gym", error: error.message });
    }
};

const getGyms = async (req, res) => {
    const gyms = await prisma.gym.findMany();
    res.json(gyms);
};

const deleteGym = async (req, res) => {
    const { id } = req.params;
    try {
        const gym = await prisma.gym.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: "Gym not found" });
    }
};

module.exports = { createGym, getGyms, deleteGym };
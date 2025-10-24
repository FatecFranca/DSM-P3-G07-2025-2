const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

const signup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing username or password" });

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(409).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { username, password: hashed }
    });

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials - usuário não encontrado" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials - senha incorreta" });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token });

    } catch (error) {
        return res.status(500).json({ message: "Erro no login", error: error.message });
    }
};

module.exports = { signup, login };
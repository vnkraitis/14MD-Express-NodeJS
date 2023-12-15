import express, { Request, Response } from 'express';
import { RowDataPacket, FieldPacket, OkPacket } from 'mysql2';
const cors = require('cors');
import { connection } from "./db";
import bodyParser from 'body-parser';
const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(cors({
  origin: '*'
}));


const equipmentRouter = express.Router();

interface Equipment {
  id: number;
  name: string;
  amount: number;
  quality: string;
  photo: string;
}

interface NewEquipment {
  name: string;
  amount: number;
  quality: string;
  photo: string;
}

// Get all equipments
app.get('/equipments', async (req: Request, res: Response) => {
  try {
    const [rows] = await connection.promise().query<RowDataPacket[]>('SELECT * FROM equipments');
    // Type assertion to let TypeScript know that rows is of type Equipment[]
    const equipments: Equipment[] = rows as Equipment[];
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load equipments' });
  }
});


// Add new equipment
app.post('/equipments', async (req: Request, res: Response) => {
  try {
    const { name, amount, quality, photo }: NewEquipment = req.body;
    const [result] = await connection.promise().query<OkPacket>(
      'INSERT INTO equipments (name, amount, quality, photo) VALUES (?, ?, ?, ?)', 
      [name, amount, quality, photo]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add equipment' });
  }
});

// Delete equipment by ID
app.delete('/equipments/:id', async (req: Request, res: Response) => {
  try {
    await connection.promise().query(
      'DELETE FROM equipments WHERE id = ?',
      [req.params.id]
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: `Failed to delete equipment with id ${req.params.id}` });
  }
});

// Update equipment
app.put('/equipments/:id', async (req: Request, res: Response) => {
  try {
    const { name, amount, quality, photo }: Equipment = req.body;
    await connection.promise().query(
      'UPDATE equipments SET name = ?, amount = ?, quality = ?, photo = ? WHERE id = ?', 
      [name, amount, quality, photo, req.params.id]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: `Failed to update equipment with id ${req.params.id}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
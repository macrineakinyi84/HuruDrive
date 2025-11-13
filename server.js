require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Helper: attempt to include likely relation names, fallback to plain findMany
async function findVehiclesWithImages() {
  const candidateIncludes = ['images', 'vehicleImages', 'vehicleImages', 'VehicleImage', 'vehicle_image'];
  for (const rel of candidateIncludes) {
    try {
      // Attempt include dynamically
      const vehicles = await prisma.vehicle.findMany({
        include: { [rel]: true }
      });
      // If query succeeded, return results (may be empty)
      return vehicles;
    } catch (err) {
      /* ignore and try next candidate */
    }
  }
  // Fallback: no includes succeeded, return plain vehicles
  return prisma.vehicle.findMany();
}

// Endpoint: list vehicles (with images when possible)
app.get('/api/vehicles', async (req, res) => {
  try {
    // If Vehicle model doesn't exist this will throw
    const vehicles = await findVehiclesWithImages();
    res.json(vehicles);
  } catch (err) {
    console.error('Error in GET /api/vehicles:', err);
    // Fallback: attempt to return vehicleImage rows if vehicles unavailable
    try {
      const imgs = await prisma.vehicleImage.findMany({ take: 50 });
      return res.json({ vehicleImages: imgs });
    } catch (err2) {
      console.error('Fallback also failed:', err2);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Endpoint: single vehicle by id
app.get('/api/vehicles/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const candidateIncludes = ['images', 'vehicleImages', 'VehicleImage', 'vehicle_image'];
  for (const rel of candidateIncludes) {
    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: { [rel]: true }
      });
      if (vehicle) return res.json(vehicle);
    } catch (err) {
      // ignore and try next
    }
  }
  // Final fallback: try without include
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return res.status(404).json({ error: 'Not found' });
    return res.json(vehicle);
  } catch (err) {
    console.error('Error in GET /api/vehicles/:id', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Utility endpoint: list vehicle images directly
app.get('/api/vehicle-images', async (req, res) => {
  try {
    const images = await prisma.vehicleImage.findMany({ take: 200 });
    res.json(images);
  } catch (err) {
    console.error('Error in GET /api/vehicle-images:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
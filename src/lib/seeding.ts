
import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, query, limit } from 'firebase/firestore';
import { 
  MOCK_RESOURCES, 
  MOCK_PROCUREMENT, 
  MOCK_INVOICES, 
  MOCK_TICKETS 
} from '../services/mockData';

export const seedDatabase = async () => {
  console.log("Starting Seeding...");
  
  // Check if data already exists to avoid duplicates (simplified check)
  const ticketsSnap = await getDocs(query(collection(db, 'tickets'), limit(1)));
  if (!ticketsSnap.empty) {
    console.log("Data already seeded.");
    return;
  }

  const batch = writeBatch(db);

  // Seed Resources
  MOCK_RESOURCES.forEach(res => {
    const ref = doc(db, 'resources', res.id);
    batch.set(ref, res);
  });

  // Seed Procurement
  MOCK_PROCUREMENT.forEach(req => {
    const ref = doc(db, 'procurement', req.id);
    batch.set(ref, req);
  });

  // Seed Invoices
  MOCK_INVOICES.forEach(inv => {
    const ref = doc(db, 'invoices', inv.id);
    batch.set(ref, inv);
  });

  // Seed Tickets
  MOCK_TICKETS.forEach(tick => {
    const ref = doc(db, 'tickets', tick.id);
    batch.set(ref, tick);
  });

  await batch.commit();
  console.log("Seeding Complete!");
};

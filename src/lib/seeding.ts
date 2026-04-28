
import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, query, limit } from 'firebase/firestore';
import { 
  MOCK_RESOURCES, 
  MOCK_PROCUREMENT, 
  MOCK_INVOICES, 
  MOCK_TICKETS,
  MOCK_VENDORS,
  MOCK_POSITIONS,
  MOCK_CANDIDATES,
  MOCK_ONBOARDING,
  MOCK_USERS,
  MOCK_CUSTOMERS
} from '../services/mockData';

export const seedDatabase = async () => {
  console.log("Starting Seeding...");
  
  // Check if data already exists
  const vendorsSnap = await getDocs(query(collection(db, 'vendors'), limit(1)));
  if (!vendorsSnap.empty) {
    console.log("Data already seeded.");
    return;
  }

  const batch = writeBatch(db);

  // Seed Users
  MOCK_USERS.forEach(u => {
    const ref = doc(db, 'users', u.id);
    batch.set(ref, u);
  });

  // Seed Customers
  MOCK_CUSTOMERS.forEach(c => {
    const ref = doc(db, 'customers', c.id);
    batch.set(ref, c);
  });

  // Seed Vendors
  MOCK_VENDORS.forEach(v => {
    const ref = doc(db, 'vendors', v.id);
    batch.set(ref, v);
  });

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

  // Seed Positions
  MOCK_POSITIONS.forEach(pos => {
    const ref = doc(db, 'positions', pos.id);
    batch.set(ref, pos);
  });

  // Seed Candidates
  MOCK_CANDIDATES.forEach(cand => {
    const ref = doc(db, 'candidates', cand.id);
    batch.set(ref, cand);
  });

  // Seed Onboarding
  MOCK_ONBOARDING.forEach(app => {
    const ref = doc(db, 'onboarding', app.id);
    batch.set(ref, app);
  });

  await batch.commit();
  console.log("Seeding Complete!");
};

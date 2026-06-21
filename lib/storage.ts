import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readFile<T>(filename: string): T[] {
  ensureDir();
  const file = path.join(DATA_DIR, filename);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return []; }
}

function writeFile(filename: string, data: unknown[]) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

export type Lead = {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  size: string;
  source?: string;
};

export type Contact = {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type Schedule = {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  segment: string;
  size: string;
  current: string;
  date: string;
  time: string;
  notes?: string;
};

export function getLeads(): Lead[] {
  return readFile<Lead>('leads.json');
}

export function addLead(data: Omit<Lead, 'id' | 'createdAt'>): Lead {
  const leads = getLeads();
  const lead: Lead = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  leads.push(lead);
  writeFile('leads.json', leads);
  return lead;
}

export function getContacts(): Contact[] {
  return readFile<Contact>('contacts.json');
}

export function addContact(data: Omit<Contact, 'id' | 'createdAt'>): Contact {
  const contacts = getContacts();
  const contact: Contact = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  contacts.push(contact);
  writeFile('contacts.json', contacts);
  return contact;
}

export function getSchedules(): Schedule[] {
  return readFile<Schedule>('schedules.json');
}

export function addSchedule(data: Omit<Schedule, 'id' | 'createdAt'>): Schedule {
  const schedules = getSchedules();
  const schedule: Schedule = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  schedules.push(schedule);
  writeFile('schedules.json', schedules);
  return schedule;
}

export function isSlotTaken(date: string, time: string): boolean {
  return getSchedules().some((s) => s.date === date && s.time === time);
}

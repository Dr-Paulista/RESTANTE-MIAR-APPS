import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  code: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MiarApp = z.infer<typeof AppSchema>;

const AppsFileSchema = z.object({
  apps: z.array(AppSchema),
});

const dataDir = path.resolve(process.cwd(), "data");
const appsFile = path.join(dataDir, "miar-apps.json");

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(appsFile);
  } catch {
    await fs.writeFile(appsFile, JSON.stringify({ apps: [] }, null, 2), "utf8");
  }
}

async function readAppsFile(): Promise<{ apps: MiarApp[] }> {
  await ensureDataFile();
  const raw = await fs.readFile(appsFile, "utf8");
  const parsed = AppsFileSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    return { apps: [] };
  }
  return parsed.data;
}

async function writeAppsFile(data: { apps: MiarApp[] }) {
  await ensureDataFile();
  await fs.writeFile(appsFile, JSON.stringify(data, null, 2), "utf8");
}

export async function listMiarApps() {
  const data = await readAppsFile();
  return data.apps.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getMiarApp(id: string) {
  const data = await readAppsFile();
  return data.apps.find((app) => app.id === id) ?? null;
}

export async function saveMiarApp(input: {
  id?: string;
  name: string;
  description: string;
  type: string;
  code: string;
}) {
  const data = await readAppsFile();
  const now = new Date().toISOString();
  const id = input.id ?? crypto.randomUUID();
  const existingIndex = data.apps.findIndex((app) => app.id === id);

  const app: MiarApp = {
    id,
    name: input.name,
    description: input.description,
    type: input.type,
    code: input.code,
    createdAt: existingIndex >= 0 ? data.apps[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    data.apps[existingIndex] = app;
  } else {
    data.apps.push(app);
  }

  await writeAppsFile(data);
  return app;
}

export async function deleteMiarApp(id: string) {
  const data = await readAppsFile();
  const before = data.apps.length;
  data.apps = data.apps.filter((app) => app.id !== id);
  await writeAppsFile(data);
  return data.apps.length < before;
}

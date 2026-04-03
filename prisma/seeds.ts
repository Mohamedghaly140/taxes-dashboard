import { Role, Status } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

/** Dev-only password for seeded accounts (Argon2id via Bun). */
const SEED_PASSWORD = "password123";

async function hashPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, {
    algorithm: "argon2id",
    memoryCost: 19456,
    timeCost: 2,
  });
}

async function main() {
  const passwordHash = await hashPassword(SEED_PASSWORD);

  try {
    await prisma.customer.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error(error);
    console.log("Error deleting data, continuing with seed...");
  }

  const alice = await prisma.user.create({
    data: {
      name: "Alice Example",
      email: "alice@example.com",
      passwordHash,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Example",
      email: "bob@example.com",
      passwordHash,
      role: Role.CLIENT,
      status: Status.ACTIVE,
    },
  });

  await prisma.customer.createMany({
    data: [
      {
        name: "Acme Corp",
        email: "billing@acme.example",
        emailPassword: "email-secret-1",
        username: "acme_corp",
        portalPassword: "portal-secret-1",
        fileNumber: "FN-2024-001",
        taxRegistrationNumber: "100000001",
        nationalId: "29001010001234",
        userId: alice.id,
      },
      {
        name: "Nile Trading",
        email: "finance@nile.example",
        emailPassword: "email-secret-2",
        username: "nile_trading",
        portalPassword: "portal-secret-2",
        fileNumber: "FN-2024-002",
        taxRegistrationNumber: "100000002",
        nationalId: "29001010005678",
        userId: alice.id,
      },
      {
        name: "Pyramid Consulting",
        email: "info@pyramid.example",
        emailPassword: "email-secret-4",
        username: "pyramid_consulting",
        portalPassword: "portal-secret-4",
        fileNumber: "FN-2024-004",
        taxRegistrationNumber: "100000004",
        nationalId: "29001010002345",
        userId: alice.id,
      },
      {
        name: "Cairo Logistics",
        email: "ops@cairo-logi.example",
        emailPassword: "email-secret-5",
        username: "cairo_logistics",
        portalPassword: "portal-secret-5",
        fileNumber: "FN-2024-005",
        taxRegistrationNumber: "100000005",
        nationalId: "29001010003456",
        userId: alice.id,
      },
      {
        name: "Sphinx Imports",
        email: "trade@sphinx.example",
        emailPassword: "email-secret-6",
        username: "sphinx_imports",
        portalPassword: "portal-secret-6",
        fileNumber: "FN-2024-006",
        taxRegistrationNumber: "100000006",
        nationalId: "29001010004567",
        userId: alice.id,
      },
      {
        name: "Alexandria Exports",
        email: "export@alexa.example",
        emailPassword: "email-secret-7",
        username: "alex_exports",
        portalPassword: "portal-secret-7",
        fileNumber: "FN-2024-007",
        taxRegistrationNumber: "100000007",
        nationalId: "29001010006789",
        userId: alice.id,
      },
      {
        name: "Luxor Finance",
        email: "accounts@luxor.example",
        emailPassword: "email-secret-8",
        username: "luxor_finance",
        portalPassword: "portal-secret-8",
        fileNumber: "FN-2024-008",
        taxRegistrationNumber: "100000008",
        nationalId: "29001010007890",
        userId: alice.id,
      },
      {
        name: "Delta Services",
        email: "accounts@delta.example",
        emailPassword: "email-secret-3",
        username: "delta_services",
        portalPassword: "portal-secret-3",
        fileNumber: "FN-2024-003",
        taxRegistrationNumber: "100000003",
        nationalId: "29001010009999",
        userId: bob.id,
      },
    ],
  });

  console.log("Seed OK: 2 users, 8 customers (7 for Alice, 1 for Bob) — password: %s", SEED_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

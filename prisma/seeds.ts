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
      role: Role.CLIENT,
      status: Status.ACTIVE,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Example",
      email: "bob@example.com",
      passwordHash,
      role: Role.ADMIN,
      status: Status.INACTIVE,
    },
  });

  await prisma.customer.createMany({
    data: [
      {
        name: "Acme Corp",
        email: "billing@acme.example",
        emailPassword: "portal-secret-1",
        username: "acme_corp",
        fileNumber: "FN-2024-001",
        taxRegistrationNumber: "TRN-EG-1000001",
        nationalId: "29001010001234",
        userId: alice.id,
      },
      {
        name: "Nile Trading",
        email: "finance@nile.example",
        username: "nile_trading",
        fileNumber: "FN-2024-002",
        taxRegistrationNumber: "TRN-EG-1000002",
        nationalId: "29001010005678",
        userId: alice.id,
      },
      {
        name: "Pyramid Consulting",
        email: "info@pyramid.example",
        emailPassword: "portal-secret-4",
        username: "pyramid_consulting",
        fileNumber: "FN-2024-004",
        taxRegistrationNumber: "TRN-EG-1000004",
        nationalId: "29001010002345",
        userId: alice.id,
      },
      {
        name: "Cairo Logistics",
        email: "ops@cairo-logi.example",
        username: "cairo_logistics",
        fileNumber: "FN-2024-005",
        taxRegistrationNumber: "TRN-EG-1000005",
        nationalId: "29001010003456",
        userId: alice.id,
      },
      {
        name: "Sphinx Imports",
        email: "trade@sphinx.example",
        emailPassword: "portal-secret-6",
        username: "sphinx_imports",
        fileNumber: "FN-2024-006",
        taxRegistrationNumber: "TRN-EG-1000006",
        nationalId: "29001010004567",
        userId: alice.id,
      },
      {
        name: "Alexandria Exports",
        email: "export@alexa.example",
        username: "alex_exports",
        fileNumber: "FN-2024-007",
        taxRegistrationNumber: "TRN-EG-1000007",
        nationalId: "29001010006789",
        userId: alice.id,
      },
      {
        name: "Luxor Finance",
        email: "accounts@luxor.example",
        emailPassword: "portal-secret-8",
        username: "luxor_finance",
        fileNumber: "FN-2024-008",
        taxRegistrationNumber: "TRN-EG-1000008",
        nationalId: "29001010007890",
        userId: alice.id,
      },
      {
        name: "Delta Services",
        email: "accounts@delta.example",
        emailPassword: "portal-secret-3",
        username: "delta_services",
        fileNumber: "FN-2024-003",
        taxRegistrationNumber: "TRN-EG-1000003",
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

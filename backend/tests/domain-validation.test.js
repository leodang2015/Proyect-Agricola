import assert from "node:assert/strict";
import test from "node:test";
import { registerSchema } from "../src/modules/auth/schema.js";
import { schemas as sowingSchemas } from "../src/modules/siembras/schema.js";
import { schemas as inventorySchemas } from "../src/modules/inventario/schema.js";
import { schemas as terrainSchemas } from "../src/modules/terrenos/schema.js";

test("registration does not allow callers to assign their own role", () => {
  const { error } = registerSchema.validate({
    name: "Productor",
    email: "producer@example.com",
    password: "a-secure-password",
    role: "administrador"
  });

  assert.ok(error);
});

test("sowing requires valid owned-resource identifiers and positive area", () => {
  const invalid = sowingSchemas.create.validate({
    terrainId: "not-an-object-id",
    cropId: "507f1f77bcf86cd799439011",
    areaHectares: 0,
    plantedAt: "2026-03-01"
  });
  const valid = sowingSchemas.create.validate({
    terrainId: "507f1f77bcf86cd799439011",
    cropId: "507f1f77bcf86cd799439012",
    areaHectares: 1.5,
    plantedAt: "2026-03-01"
  });

  assert.ok(invalid.error);
  assert.equal(valid.error, undefined);
});

test("inventory rejects direct quantity changes and owner fields from clients", () => {
  const quantityOverride = inventorySchemas.create.validate({
    name: "Semilla",
    category: "insumo",
    quantity: -1,
    unit: "kg"
  });
  const ownerOverride = inventorySchemas.create.validate({
    name: "Semilla",
    category: "insumo",
    quantity: 5,
    unit: "kg",
    ownerId: "507f1f77bcf86cd799439011"
  });

  assert.ok(quantityOverride.error);
  assert.ok(ownerOverride.error);
});

test("terrain accepts official states and valid coordinates", () => {
  const valid = terrainSchemas.create.validate({
    name: "Lote norte",
    areaHectares: 2.5,
    status: "disponible",
    latitude: 7.125,
    longitude: -73.119,
    soilType: "Franco"
  });
  const invalid = terrainSchemas.update.validate({
    status: "sembrado_barbecho",
    latitude: 91
  });

  assert.equal(valid.error, undefined);
  assert.ok(invalid.error);
});

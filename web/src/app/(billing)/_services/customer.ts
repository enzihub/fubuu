import { eq } from 'drizzle-orm';
import { customers, InsertCustomer, SelectCustomer, users } from '@/db/schema';
import { db } from '@/db/db';

export async function getOrCreateCustomer({
  email,
  stripeCustomerId,
}: {
  email: string;
  stripeCustomerId: string; // Changed to required parameter since it's notNull in schema
}): Promise<SelectCustomer> {
  try {
    // First try to find existing customer
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    if (existingCustomer.length > 0) {
      return existingCustomer[0];
    }

    // Create new customer in database
    try {
      const newCustomer = await db
        .insert(customers)
        .values({
          email,
          stripeCustomerId,
        } satisfies InsertCustomer)
        .returning();

      return newCustomer[0];
    } catch (error) {
      throw new Error(
        `Failed to create customer in database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
}

export async function getCustomerByEmail(
  email: string,
): Promise<SelectCustomer | null> {
  try {
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    return customer[0] || null;
  } catch (error) {
    console.error('Error fetching customer by email:', error);
    return null;
  }
}

export const getCustomerIdByClerkId = async (
  clerkId: string,
): Promise<string> => {
  try {
    const customer = await db
      .select({
        stripeCustomerId: customers.stripeCustomerId,
      })
      .from(users)
      .innerJoin(customers, eq(users.id, customers.userId))
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!customer || customer.length === 0) {
      throw new Error('Customer not found');
    }

    return customer[0].stripeCustomerId;
  } catch (error) {
    console.error('Error getting customer ID:', error);
    throw error;
  }
};

export async function upsertCustomer({
  email,
  stripeCustomerId,
}: {
  email: string;
  stripeCustomerId: string;
}): Promise<SelectCustomer> {
  try {
    // Look up user by email instead of clerk ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user[0]) {
      throw new Error(`No user found with email: ${email}`);
    }

    const userId = user[0].id;

    // Check if customer already exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    if (existingCustomer.length > 0) {
      // Update existing customer
      const updatedCustomer = await db
        .update(customers)
        .set({
          stripeCustomerId,
          userId,
          updatedAt: new Date(),
        })
        .where(eq(customers.email, email))
        .returning();

      return updatedCustomer[0];
    }

    // Create new customer
    const newCustomer = await db
      .insert(customers)
      .values({
        email,
        stripeCustomerId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies InsertCustomer)
      .returning();

    return newCustomer[0];
  } catch (error) {
    console.error('Error in upsertCustomer:', error);
    throw new Error(
      `Failed to upsert customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function deleteCustomerById(stripeCustomerId: string) {
  try {
    await db
      .delete(customers)
      .where(eq(customers.stripeCustomerId, stripeCustomerId));

    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw new Error(
      `Failed to delete customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

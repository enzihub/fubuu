// newsletter.service.ts

'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUserPref, userPrefs, InsertUserPref } from '@/db/schema';
import { getOrCreateUser } from '@/app/(user)/_services/user.service';
export async function createTweetPref(
  email: string,
  phone: string,
  timezone: string,
): Promise<SelectUserPref> {
  try {
    // First, ensure we have a user with a proper UUID
    const user = await getOrCreateUser(email);

    // Check if preference exists
    const existingPref = await db
      .select()
      .from(userPrefs)
      .where(eq(userPrefs.email, user.email))
      .limit(1);

    if (existingPref.length > 0) {
      return existingPref[0];
    }

    // Create new preference
    const newPref = await db
      .insert(userPrefs)
      .values({
        userId: user.id,
        email,
        timezone,
        phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies InsertUserPref)
      .returning();

    return newPref[0];
  } catch (error) {
    throw new Error(
      `Failed to create tweet preference: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function getUserTweetPref(
  email: string,
): Promise<SelectUserPref | null> {
  try {
    const pref = await db
      .select()
      .from(userPrefs)
      .where(eq(userPrefs.email, email))
      .limit(1);

    return pref[0] || null;
  } catch (error) {
    return null;
  }
}

export async function upsertTweetPref(
  userId: string,
  email: string,
  phone: string,
  customPrompt: string,
  description: string,
  timezone: string
): Promise<SelectUserPref> {
  try {
    const existingPref = await db
      .select()
      .from(userPrefs)
      .where(eq(userPrefs.email, email))
      .limit(1);

    if (existingPref.length > 0) {
      // Update existing preference
      const updatedPref = await db
        .update(userPrefs)
        .set({
          userId,
          phone,
          customPrompt,
          description,
          timezone,
          updatedAt: new Date(),
        })
        .where(eq(userPrefs.email, email))
        .returning();

      return updatedPref[0];
    } else {
      // Create new preference
      const newPref = await db
        .insert(userPrefs)
        .values({
          userId,
          email,
          phone,
          customPrompt,
          description,
          timezone,
          createdAt: new Date(),
          updatedAt: new Date(),
        } satisfies InsertUserPref)
        .returning();

      return newPref[0];
    }
  } catch (error) {
    throw new Error(
      `Failed to upsert tweet preference: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}


// export async function createTweetPref(
//   userId: string,
//   email: string,
//   phone: string,
//   timezone: string,
// ) {
//   //  Create if a pref not exist for user.
//   try {
//     const { data: userTweetPref } = await faunaClient.query(fql`
//       let userTweetPref = Collection("UserTweetPrefs")
//       let doc = userTweetPref.firstWhere(.userId == ${userId})
//       if (doc != null) {
//         {doc}
//       } else {
//         userTweetPref.create({
//           userId: ${userId},
//           email: ${email},
//           timezone: ${timezone},
//           phone: ${phone},
//             updatedAt: Time.now(),
//             createdAt: Time.now()
//         })
//       }
//     `);
//
//     return docTo<UserTweetPref>(userTweetPref);
//   } catch (error) {
//     if (error instanceof ServiceError) {
//       throw error;
//     }
//     throw new Error(`Failed to upsert UserNewsletter: ${error}`);
//   }
// }
//
// export async function getUserTweetPref(
//   userId: string,
// ): Promise<UserTweetPref | null> {
//   try {
//     const { data: tweetPref } = await faunaClient.query(fql`
//         let userTweetPrefs = Collection("UserTweetPrefs")
//         userTweetPrefs.firstWhere(.userId == ${userId})!
//         `);
//     return docTo<UserTweetPref>(tweetPref);
//   } catch (error) {
//     return null;
//   }
// }
//
// export async function upsertTweetPref(
//   userId: string,
//   email: string,
//   phone: string,
//   timezone: string,
// ) {
//   try {
//     const { data: userTweetPref } = await faunaClient.query(fql`
//       let userTweetPrefs = Collection("UserTweetPrefs")
//       let doc = userTweetPrefs.firstWhere(.userId == ${userId})
//       if (doc != null) {
//         doc.update({
//           userId: ${userId},
//           phone: ${phone},
//           timezone: ${timezone},
//           updatedAt: Time.now()
//         })
//       } else {
//         userTweetPrefs.create({
//           userId: ${userId},
//           email: ${email},
//           timezone: ${timezone},
//           phone: ${phone},
//             updatedAt: Time.now(),
//             createdAt: Time.now()
//         })
//       }
//     `);
//
//     return docTo<UserTweetPref>(userTweetPref);
//   } catch (error) {
//     if (error instanceof ServiceError) {
//       throw error;
//     }
//     throw new Error(`Failed to upsert UserNewsletter: ${error}`);
//   }
// }

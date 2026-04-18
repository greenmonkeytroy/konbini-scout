"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import SnackForm from "@/components/admin/SnackForm";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditSnackPage() {
  const { id } = useParams<{ id: string }>();
  const snack = useQuery(api.snacks.byId, { id: id as Id<"snacks"> });

  if (snack === undefined) {
    return <p className="text-nori-light">Loading…</p>;
  }
  if (snack === null) {
    return <p className="text-nori-light">Snack not found.</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-3xl text-nori">Edit Snack</h1>

      <SnackForm
        snackId={snack._id}
        initialValues={{
          name: snack.name,
          makerId: snack.makerId,
          category: snack.category,
          description: snack.description,
          flavourNotes: snack.flavourNotes,
          flavourIds: snack.flavourIds,
          isPublished: snack.isPublished,
        }}
      />

      {/* Image uploads */}
      <div className="mt-10 space-y-6 border-t border-border-warm pt-8">
        <h2 className="font-display text-xl text-nori">Images</h2>
        <div className="grid grid-cols-2 gap-4">
          <ImageUpload
            snackId={snack._id}
            imageType="illustration"
            currentUrl={snack.illustrationUrl ?? null}
            label="Shelf Illustration"
          />
          <ImageUpload
            snackId={snack._id}
            imageType="photo"
            currentUrl={snack.photoUrl ?? null}
            label="Product Photo"
          />
        </div>
      </div>
    </div>
  );
}

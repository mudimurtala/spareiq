import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { DashboardLayout } from "../../features/dashboard/components/DashboardLayout";
import type { SparePart } from "../../types/sparePart";

export const EditPartPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Engine");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [condition, setCondition] = useState<"new" | "tokunbo">("new");
  const [price, setPrice] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const categories = [
    "Engine",
    "Brakes",
    "Electrical",
    "Suspension",
    "Body Parts",
    "Cooling System",
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const docRef = doc(db, "parts", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          alert("Part not found");
          navigate("/dashboard/inventory");
          return;
        }
        const data = snap.data() as Omit<SparePart, "id">;
        setName(data.name || "");
        setCategory(data.category || "Engine");
        setCarMake(data.carMake || "");
        setCarModel(data.carModel || "");
        setCarYear(data.carYear || "");
        setCondition(data.condition || "new");
        setPrice(data.price || 0);
        setStockQuantity(data.stockQuantity || 0);
        setDescription(data.description || "");
        setImageUrl(data.imageUrl || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load part");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );

      const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const res = await fetch(url, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.secure_url || "");
    } catch (err) {
      console.error(err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    return (
      name.trim() &&
      category.trim() &&
      carMake.trim() &&
      carModel.trim() &&
      carYear.trim() &&
      (condition === "new" || condition === "tokunbo") &&
      price > 0 &&
      stockQuantity >= 0 &&
      description.trim() &&
      imageUrl.trim()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!validate()) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    try {
      const docRef = doc(db, "parts", id);
      await updateDoc(docRef, {
        name: name.trim(),
        category,
        carMake: carMake.trim(),
        carModel: carModel.trim(),
        carYear: carYear.trim(),
        condition,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        imageUrl,
        description: description.trim(),
      });
      await qc.invalidateQueries({ queryKey: ["parts"] });
      alert("Part updated successfully");
      navigate("/dashboard/inventory");
    } catch (err) {
      console.error(err);
      alert("Failed to update part. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="h-12 w-12 rounded-full border-4 border-primary-950 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/dashboard/inventory")}
          className="mb-4 text-sm font-semibold text-primary-950 hover:text-accent-500"
        >
          ← Back to Inventory
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-primary-950 mb-6">
          Edit Part
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Make
              </label>
              <input
                value={carMake}
                onChange={(e) => setCarMake(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Model
              </label>
              <input
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Year
              </label>
              <input
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value="new"
                  checked={condition === "new"}
                  onChange={() => setCondition("new")}
                  className="w-4 h-4 text-accent-500"
                />
                <span className="text-gray-700">New</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value="tokunbo"
                  checked={condition === "tokunbo"}
                  onChange={() => setCondition("tokunbo")}
                  className="w-4 h-4 text-accent-500"
                />
                <span className="text-gray-700">Tokunbo</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price in Naira
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700"
            />

            {uploading && (
              <p className="mt-2 text-sm text-gray-600">Uploading image…</p>
            )}

            {imageUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Preview</p>
                <img
                  src={imageUrl}
                  alt="Uploaded preview"
                  className="w-48 h-48 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="w-full inline-flex items-center justify-center rounded-md bg-accent-500 px-6 py-3 font-bold text-primary-950 hover:bg-opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditPartPage;

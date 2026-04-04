import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadFiles } from '../../lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadSimple, CheckCircle } from '@phosphor-icons/react';

const CATEGORIES = ['Residential', 'Commercial', 'Interior', 'Landscape'];

export default function ProjectForm({ project, onSuccess, onCancel }) {
  const isEditing = Boolean(project);

  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [category, setCategory] = useState(project?.category || CATEGORIES[0]);
  const [existingImages, setExistingImages] = useState(project?.images || []);
  const [newFiles, setNewFiles] = useState([]); // [{file, preview, id}]
  const [uploadProgress, setUploadProgress] = useState({}); // {id: 0-100}
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    const previews = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      id: `${f.name}-${Date.now()}-${Math.random()}`
    }));
    setNewFiles(prev => [...prev, ...previews]);
  };

  const removeNewFile = (id) => setNewFiles(prev => prev.filter(f => f.id !== id));
  const removeExistingImage = (url) => setExistingImages(prev => prev.filter(u => u !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required.');
    if (existingImages.length + newFiles.length === 0) return setError('Add at least one image.');
    setError('');
    setSaving(true);

    try {
      // Upload new files to Supabase Storage
      const newUrls = await uploadFiles(
        newFiles,
        'projects',
        (id, pct) => setUploadProgress(prev => ({ ...prev, [id]: pct }))
      );

      const allImages = [...existingImages, ...newUrls];
      const data = {
        title: title.trim(),
        description: description.trim(),
        category,
        images: allImages,
        coverImage: allImages[0],
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase.from('projects').update(data).eq('id', project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([data]);
        if (error) throw error;
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">Project Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. South City Residence"
          className="bg-transparent border border-glassBorder rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted/60 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project, materials used, scope..."
          rows={4}
          className="bg-transparent border border-glassBorder rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted/60 focus:outline-none focus:border-accent transition-colors resize-y"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">Category</label>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-accent text-white shadow-lg'
                  : 'border border-glassBorder hover:border-accent text-textMuted hover:text-textMain'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">
          Photos * <span className="normal-case text-textMuted/60">(first image = cover photo)</span>
        </label>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-glassBorder hover:border-accent rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <UploadSimple size={32} className="mx-auto mb-2 text-textMuted group-hover:text-accent transition-colors" />
          <p className="text-textMuted text-sm">Click to select images or drag &amp; drop</p>
          <p className="text-textMuted/50 text-xs mt-1">JPG, PNG, WebP — multiple allowed</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <p className="text-xs text-textMuted/70 mb-2">Current photos</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {existingImages.map((url, i) => (
                <div key={url} className="relative group rounded-xl overflow-hidden aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-semibold">Cover</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Preview Images */}
        {newFiles.length > 0 && (
          <div>
            <p className="text-xs text-textMuted/70 mb-2">New photos to upload</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <AnimatePresence>
                {newFiles.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group rounded-xl overflow-hidden aspect-square"
                  >
                    <img src={f.preview} alt="" className="w-full h-full object-cover" />
                    {saving && uploadProgress[f.id] !== undefined && uploadProgress[f.id] < 100 && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                        <span className="text-white text-xs font-bold">{uploadProgress[f.id]}%</span>
                        <div className="w-3/4 h-1 bg-white/20 rounded-full mt-1">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${uploadProgress[f.id]}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {saving && uploadProgress[f.id] === 100 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-400" weight="fill" />
                      </div>
                    )}
                    {!saving && (
                      <button
                        type="button"
                        onClick={() => removeNewFile(f.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 py-3 rounded-xl border border-glassBorder text-textMuted hover:text-textMain hover:border-accent transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(var(--accent-rgb),0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {isEditing ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  );
}

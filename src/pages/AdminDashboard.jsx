import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SignOut, Plus, Pencil, Trash, FolderOpen,
  Images, X, UploadSimple, CheckCircle, Warning, EnvelopeSimple
} from '@phosphor-icons/react';
import { supabase } from '../lib/supabase';
import { uploadFile, deleteFile } from '../lib/storage';
import { useAuth } from '../contexts/AuthContext';
import ProjectForm from '../components/admin/ProjectForm';
import MessagesManager from '../components/admin/MessagesManager';

import ImageCropper from '../components/admin/ImageCropper';

// ─── Hero Image Manager ────────────────────────────────────────────
function HeroImageManager() {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState(null);
  const [toast, setToast] = useState('');
  const fileInputRef = useRef();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('value').eq('key', 'hero').single();
      if (!error && data) setHeroImages(data.value?.images || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchHero(); }, []);

  const saveHero = async (images) => {
    await supabase.from('settings').upsert({ key: 'hero', value: { images } });
    setHeroImages(images);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setCropFile(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset
  };

  const handleCropComplete = async (croppedFile) => {
    setCropFile(null); // Close cropper
    setUploading(true);
    try {
      const url = await uploadFile(croppedFile, 'hero');
      const updated = [...heroImages, url];
      await saveHero(updated);
      showToast('Hero image updated!');
    } catch (err) {
      showToast(`Upload failed: ${err.message}`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeHeroImage = async (url) => {
    const updated = heroImages.filter(u => u !== url);
    await saveHero(updated);
    await deleteFile(url); // also removes from Supabase Storage
    showToast('Image removed.');
  };

  return (
    <div className="glass rounded-3xl p-8 border border-glassBorder">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold text-textMain">Hero Slideshow</h2>
          <p className="text-textMuted text-sm mt-1">Images shown in the stacked card carousel on the homepage.</p>
        </div>
        <label className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(var(--accent-rgb),0.3)] transition-all text-sm ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <UploadSimple size={18} />
          {uploading ? `Uploading...` : 'Upload Hero Image'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : heroImages.length === 0 ? (
        <div className="text-center py-12 text-textMuted">
          <Images size={40} className="mx-auto mb-3 opacity-40" />
          <p>No hero images yet. Upload some above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {heroImages.map((url, i) => (
            <div key={url} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">
                  Front
                </span>
              )}
              <button
                onClick={() => removeHeroImage(url)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cropper Modal */}
      {cropFile && (
        <ImageCropper 
          file={cropFile} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setCropFile(null)} 
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 flex items-center gap-2 text-green-400 text-sm"
          >
            <CheckCircle size={16} weight="fill" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Delete Confirm Modal ───────────────────────────────────────────
function DeleteConfirm({ project, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-3xl border border-red-500/30 max-w-sm w-full text-center"
      >
        <Warning size={40} className="text-red-400 mx-auto mb-4" weight="fill" />
        <h3 className="text-xl font-display font-bold mb-2">Delete Project?</h3>
        <p className="text-textMuted text-sm mb-6">
          "<span className="text-textMain font-medium">{project.title}</span>" will be permanently removed from your portfolio.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-glassBorder text-textMuted hover:text-textMain transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────
export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [modal, setModal] = useState(null); // 'add' | {type:'edit', project} | {type:'delete', project}
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'hero'

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const { data, error } = await supabase.from('projects').select('*').order('createdAt', { ascending: false });
      if (!error && data) setProjects(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingProjects(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const handleDelete = async (project) => {
    try {
      await supabase.from('projects').delete().eq('id', project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
      setModal(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-bgMain">
      {/* Top Bar */}
      <header className="glass border-b border-glassBorder sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent rounded-lg p-1.5">
              <img src="/images/new_logo.png" alt="Logo" className="h-7 w-auto" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <div>
              <span className="text-lg font-display font-black uppercase tracking-tighter text-textMain">DESIGN</span>
              <p className="text-xs text-textMuted leading-none">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-textMuted">{currentUser?.email}</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline hidden sm:block"
            >
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-glassBorder text-textMuted hover:text-red-400 hover:border-red-400/50 transition-all text-sm"
            >
              <SignOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'projects'
                ? 'bg-accent text-white shadow-lg'
                : 'border border-glassBorder text-textMuted hover:text-textMain'
            }`}
          >
            <FolderOpen size={18} />
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'hero'
                ? 'bg-accent text-white shadow-lg'
                : 'border border-glassBorder text-textMuted hover:text-textMain'
            }`}
          >
            <Images size={18} />
            Hero Images
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'messages'
                ? 'bg-accent text-white shadow-lg'
                : 'border border-glassBorder text-textMuted hover:text-textMain'
            }`}
          >
            <EnvelopeSimple size={18} />
            Messages
          </button>
        </div>

        {/* ── Projects Tab ── */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-display font-bold text-textMain">Portfolio Projects</h1>
                <p className="text-textMuted mt-1">Manage the projects shown in the public portfolio.</p>
              </div>
              <button
                onClick={() => setModal('add')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(var(--accent-rgb),0.35)] transition-all"
              >
                <Plus size={20} />
                Add Project
              </button>
            </div>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-24">
                <span className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="glass border border-glassBorder rounded-3xl text-center py-24">
                <FolderOpen size={56} className="mx-auto text-textMuted/30 mb-4" />
                <h3 className="text-xl font-display font-semibold text-textMain mb-2">No Projects Yet</h3>
                <p className="text-textMuted mb-6">Create your first project to get started.</p>
                <button
                  onClick={() => setModal('add')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:-translate-y-0.5 transition-all"
                >
                  <Plus size={18} />
                  Add Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass border border-glassBorder rounded-2xl overflow-hidden group"
                    >
                      {/* Cover Image */}
                      <div className="relative aspect-video overflow-hidden">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-glassBg flex items-center justify-center">
                            <Images size={32} className="text-textMuted/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/80 uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          {project.category}
                        </span>
                        <span className="absolute bottom-3 right-3 text-xs text-white/60">
                          {project.images?.length || 0} photos
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h3 className="text-lg font-display font-semibold text-textMain truncate">{project.title}</h3>
                        {project.description && (
                          <p className="text-textMuted text-sm mt-1 line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => setModal({ type: 'edit', project })}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-glassBorder text-textMuted hover:text-accent hover:border-accent transition-all text-sm font-medium"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                          <button
                            onClick={() => setModal({ type: 'delete', project })}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-glassBorder text-textMuted hover:text-red-400 hover:border-red-400/50 transition-all text-sm font-medium"
                          >
                            <Trash size={15} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* ── Hero Tab ── */}
        {activeTab === 'hero' && <HeroImageManager />}

        {/* ── Messages Tab ── */}
        {activeTab === 'messages' && <MessagesManager />}
      </main>

      {/* ── Modals ── */}
      {/* Add Project Modal */}
      <AnimatePresence>
        {modal === 'add' && (
          <motion.div
            key="add-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="glass border border-glassBorder rounded-3xl p-8 w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">New Project</h2>
                <button onClick={() => setModal(null)} className="text-textMuted hover:text-textMain transition-colors">
                  <X size={24} />
                </button>
              </div>
              <ProjectForm
                onSuccess={() => { setModal(null); fetchProjects(); }}
                onCancel={() => setModal(null)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Edit Project Modal */}
        {modal?.type === 'edit' && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="glass border border-glassBorder rounded-3xl p-8 w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Edit Project</h2>
                <button onClick={() => setModal(null)} className="text-textMuted hover:text-textMain transition-colors">
                  <X size={24} />
                </button>
              </div>
              <ProjectForm
                project={modal.project}
                onSuccess={() => { setModal(null); fetchProjects(); }}
                onCancel={() => setModal(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      {modal?.type === 'delete' && (
        <DeleteConfirm
          project={modal.project}
          onConfirm={() => handleDelete(modal.project)}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}

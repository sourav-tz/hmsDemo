import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

const Profilesettings = () => {
  const [profile, setProfile] = useState(null);
  const [editingMobile, setEditingMobile] = useState(false);
  const [mobileInput, setMobileInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BASE_URL + '/HA/getProfile',
        { withCredentials: true }
      );
      setProfile(res.data.data);
      setMobileInput(res.data.data.mobile || '');
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveMobile = async () => {
    if (!/^[0-9]{10}$/.test(mobileInput)) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    setSaving(true);
    try {
      await axios.patch(
        import.meta.env.VITE_BASE_URL + '/HA/updateMobile',
        { mobile: mobileInput },
        { withCredentials: true }
      );
      toast.success('Mobile number updated');
      setProfile((prev) => ({ ...prev, mobile: mobileInput }));
      setEditingMobile(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to update mobile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMobile = () => {
    setMobileInput(profile?.mobile || '');
    setEditingMobile(false);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer limit={1} />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-1">{profile.name}</h1>
          <p className="text-gray-500 mb-6">{profile.roleType} — Hostel {profile.hostelNo}</p>

          <Card className="p-6 flex flex-col gap-6">

            {/* Email — read only */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <Input value={profile.email} disabled className="max-w-sm bg-gray-50" />
            </div>

            {/* Name — read only */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Name</label>
              <Input value={profile.name} disabled className="max-w-sm bg-gray-50" />
            </div>

            {/* Mobile — editable */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                WhatsApp / Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  disabled={!editingMobile}
                  placeholder="10-digit mobile number"
                  className="max-w-sm"
                  maxLength={10}
                />
                {!editingMobile ? (
                  <button
                    onClick={() => setEditingMobile(true)}
                    className="p-2 rounded-md border border-gray-200 hover:shadow-sm transition"
                    title="Edit mobile"
                  >
                    <FiEdit2 className="text-gray-600" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveMobile}
                      disabled={saving}
                      className="p-2 rounded-md border border-green-400 hover:shadow-sm transition"
                      title="Save"
                    >
                      <FiCheck className="text-green-600" />
                    </button>
                    <button
                      onClick={handleCancelMobile}
                      className="p-2 rounded-md border border-red-300 hover:shadow-sm transition"
                      title="Cancel"
                    >
                      <FiX className="text-red-500" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                This number will be used for WhatsApp notifications and chatbot integration.
              </p>
            </div>

          </Card>
        </div>
      </div>
    </>
  );
};

export default Profilesettings;

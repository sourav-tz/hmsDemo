import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { setUserData } from '../../../Store/Reducers/userSlice';

const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(n => n[0].toUpperCase()).join('');
};

const Field = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <Label className="text-gray-500 text-xs">{label}</Label>
        <Input value={value || '—'} readOnly className="bg-gray-50 text-gray-800 cursor-default" />
    </div>
);

const Profilesettings = () => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userStorage.data);
    const info = userData?.dataValues || userData || {};
    const [mobile, setMobile] = useState(userData?.mobile || info.mobile || '');
    const [saving, setSaving] = useState(false);

    const name    = info.name    || userData?.name    || 'Unknown';
    const email   = info.email   || userData?.email   || '—';
    const hostelNo = info.hostelNo ?? '—';
    const role    = (userData?.role || '—').replace(/-/g, ' ');
    const avatar  = userData?.avatar;

    const saveMobile = async (event) => {
        event.preventDefault();
        const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

        if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
            toast.error('Enter a valid 10 digit mobile number');
            return;
        }

        setSaving(true);
        try {
            const res = await axios.patch(
                import.meta.env.VITE_BASE_URL + '/HA/updateMobile',
                { mobile: cleanMobile },
                { withCredentials: true }
            );

            dispatch(setUserData({ ...userData, mobile: res.data.mobile }));
            toast.success('Mobile number updated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update mobile number');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-12 px-4">
            <div className="w-full max-w-xl flex flex-col gap-6">

                <div>
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Your account information</p>
                </div>

                {/* Avatar + name */}
                <Card>
                    <CardContent className="flex items-center gap-5 pt-6">
                        {avatar
                            ? <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
                            : (
                                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ lineHeight: 1 }}>
                                    {getInitials(name)}
                                </div>
                            )
                        }
                        <div>
                            <p className="text-lg font-semibold">{name}</p>
                            <p className="text-sm text-gray-500">{role}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Details */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Field label="Full Name"   value={name} />
                        <Field label="Email"       value={email} />
                        <Field label="Role"        value={role} />
                        <Field label="Hostel No"   value={hostelNo} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Telegram Verification Mobile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={saveMobile} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <Label className="text-gray-500 text-xs">Mobile Number</Label>
                                <Input
                                    value={mobile}
                                    onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="10 digit mobile number"
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Profilesettings;

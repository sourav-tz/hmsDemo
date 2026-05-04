import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
    const userData = useSelector(state => state.userStorage.data);
    const info = userData?.dataValues || userData || {};

    const name    = info.name    || userData?.name    || 'Unknown';
    const email   = info.email   || userData?.email   || '—';
    const hostelNo = info.hostelNo ?? '—';
    const role    = (userData?.role || '—').replace(/-/g, ' ');
    const avatar  = userData?.avatar;

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

            </div>
        </div>
    );
};

export default Profilesettings;

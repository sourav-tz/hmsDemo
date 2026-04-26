import { useEffect, useState } from 'react'
import { Input } from '../../../components/ui/input'
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import axios from 'axios'

const Profilesettings = () => {
    const [profile, setProfile] = useState({ email: '', mobile: '' })
    const [editing, setEditing] = useState(false)
    const [mobileInput, setMobileInput] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchProfile = async () => {
        try {
            const res = await axios.get(
                import.meta.env.VITE_BASE_URL + '/SA/getProfile',
                { withCredentials: true }
            )
            setProfile(res.data.data)
            setMobileInput(res.data.data.mobile || '')
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const startEdit = () => {
        setMobileInput(profile.mobile || '')
        setError('')
        setSuccess('')
        setEditing(true)
    }

    const cancelEdit = () => {
        setEditing(false)
        setError('')
    }

    const saveMobile = async () => {
        if (!/^[0-9]{10}$/.test(mobileInput)) {
            setError('Enter a valid 10-digit mobile number')
            return
        }
        setLoading(true)
        setError('')
        try {
            await axios.patch(
                import.meta.env.VITE_BASE_URL + '/SA/updateMobile',
                { mobile: mobileInput },
                { withCredentials: true }
            )
            setProfile((prev) => ({ ...prev, mobile: mobileInput }))
            setSuccess('Mobile number updated successfully')
            setEditing(false)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update mobile number')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex">
            <div className="flex-[2] flex px-8 py-10 flex-col border border-gray-200 rounded-md mt-8">

                {/* Header */}
                <div>
                    <h2 className="text-2xl font-semibold">Super Admin</h2>
                    <p className="text-gray-500">{profile.email}</p>
                </div>

                {/* Fields */}
                <div className="mt-8 flex flex-col gap-6">

                    {/* Email — read only */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 font-medium">Email</label>
                        <Input
                            className="w-[280px] bg-gray-50"
                            type="text"
                            value={profile.email}
                            readOnly
                        />
                    </div>

                    {/* Mobile — editable */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 font-medium">Mobile No.</label>

                        {editing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    className="w-[280px]"
                                    type="tel"
                                    maxLength={10}
                                    placeholder="10-digit mobile number"
                                    value={mobileInput}
                                    onChange={(e) => {
                                        setMobileInput(e.target.value.replace(/\D/g, ''))
                                        setError('')
                                    }}
                                    autoFocus
                                />
                                <button
                                    onClick={saveMobile}
                                    disabled={loading}
                                    className="p-2 rounded-md border border-green-500 text-green-600 hover:bg-green-50 disabled:opacity-50"
                                    title="Save"
                                >
                                    <FiCheck size={16} />
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
                                    title="Cancel"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Input
                                    className="w-[280px] bg-gray-50"
                                    type="text"
                                    value={profile.mobile ? `+91 ${profile.mobile}` : 'Not set'}
                                    readOnly
                                />
                                <button
                                    onClick={startEdit}
                                    className="p-2 rounded-md border border-gray-200 hover:shadow-md text-gray-600"
                                    title="Edit"
                                >
                                    <FiEdit2 size={16} />
                                </button>
                            </div>
                        )}

                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        {success && <p className="text-green-600 text-sm mt-1">{success}</p>}
                    </div>

                </div>
            </div>

            <div className="mt-12 flex-1" />
        </div>
    )
}

export default Profilesettings

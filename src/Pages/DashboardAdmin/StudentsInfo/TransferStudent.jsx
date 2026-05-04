// Bug fix by Ravi: Bug 10 - Student hostel transfer workflow was completely missing
// Redesigned with Single / Bulk toggle:
//   Single mode  → quick transfer of 1–few students to one hostel
//   Bulk mode    → multi-group year-end migrations with filter-loader, select-all, and pre-submit summary
// Backend endpoint POST /HA/applications/bulk-hostel-change handles both modes (one call per group)
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const emptyGroup = () => ({ id: Date.now() + Math.random(), rollNos: [], destHostelNo: '', filterHostel: '', filterYear: '' });

// ─── small helpers ────────────────────────────────────────────────────────────

// Chip/tag input: type a roll number, press Enter or comma to confirm it as a chip
function ChipInput({ chips, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState('');

  const addChips = (raw) => {
    const newOnes = raw.split(/[\s,]+/).map(r => r.trim()).filter(Boolean);
    if (newOnes.length) onChange([...new Set([...chips, ...newOnes])]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addChips(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && chips.length) {
      onChange(chips.slice(0, -1));
    }
  };

  return (
    <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center border rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
      {chips.map(chip => (
        <span key={chip} className="bg-blue-100 text-blue-700 text-sm px-2.5 py-0.5 rounded-full flex items-center gap-1">
          {chip}
          <button type="button" onClick={() => onChange(chips.filter(c => c !== chip))} className="hover:text-red-500 leading-none">×</button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[140px] outline-none text-sm bg-transparent placeholder-gray-400"
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputVal && addChips(inputVal)}
        placeholder={chips.length === 0 ? placeholder : 'Add another…'}
      />
    </div>
  );
}

function SummaryTable({ groups, students, hostels }) {
  const rows = useMemo(() => {
    const out = [];
    groups.forEach(g => {
      const dest = hostels.find(h => String(h.hostelNo) === g.destHostelNo);
      g.rollNos.forEach(rno => {
        const s = students.find(st => st.rollNo === rno);
        const srcHostel = hostels.find(h => String(h.hostelNo) === String(s?.hostelNo));
        out.push({
          rollNo: rno,
          name: s ? `${s.firstName} ${s.lastName}` : '—',
          from: srcHostel ? `H${srcHostel.hostelNo} ${srcHostel.hostelName}` : '—',
          to: dest ? `H${dest.hostelNo} ${dest.hostelName}` : '—',
          conflict: s && String(s.hostelNo) === g.destHostelNo,
        });
      });
    });
    return out;
  }, [groups, students, hostels]);

  if (rows.length === 0) return null;

  return (
    <Card className="w-full mt-4 border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pre-submit Summary — {rows.length} student{rows.length > 1 ? 's' : ''}</CardTitle>
        {rows.some(r => r.conflict) && (
          <p className="text-xs text-amber-600">⚠ Highlighted rows: student is already in the target hostel</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left py-1 pr-3">Roll No</th>
                <th className="text-left py-1 pr-3">Name</th>
                <th className="text-left py-1 pr-3">From</th>
                <th className="text-left py-1">To</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-b ${r.conflict ? 'bg-amber-50' : ''}`}>
                  <td className="py-1 pr-3 font-mono">{r.rollNo}</td>
                  <td className="py-1 pr-3">{r.name}</td>
                  <td className="py-1 pr-3 text-gray-500">{r.from}</td>
                  <td className={`py-1 font-medium ${r.conflict ? 'text-amber-600' : 'text-blue-600'}`}>
                    {r.to} {r.conflict && '⚠'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Banner shown near the submit button (not at the top)
function TrackingBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2.5 text-sm text-blue-700 text-center">
      After submitting, forward the application to Super Admin from{' '}
      <a href="/adminDashboard/admin/applicationstatus" className="underline font-medium">
        Application → Status of Application
      </a>
      . Students are transferred only after Super Admin approves.
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function TransferStudent() {
  const [mode, setMode] = useState('single');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Single mode — array for chip input
  const [singleRollNos, setSingleRollNos] = useState([]);
  const [singleDest, setSingleDest] = useState('');

  // Bulk mode
  const [groups, setGroups] = useState([emptyGroup()]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + '/SA/getHostels', { withCredentials: true })
      .then(r => setHostels(r.data || []))
      .catch(() => {});
    axios.get(import.meta.env.VITE_BASE_URL + '/HA/getStudentsInfo', { withCredentials: true })
      .then(r => setStudents(r.data?.result || r.data || []))
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setSingleRollNos([]); setSingleDest('');
    setGroups([emptyGroup()]); setSubject(''); setDescription('');
    setShowSummary(false);
  };

  // ── single submit ──
  const submitSingle = async () => {
    if (!singleRollNos.length || !singleDest || !subject || !description) {
      toast.error('Fill all fields'); return;
    }
    setLoading(true);
    try {
      await axios({
        method: 'POST',
        url: import.meta.env.VITE_BASE_URL + '/HA/applications/bulk-hostel-change',
        withCredentials: true,
        data: { subject, description, tag: 'hostel-transfer', extraData: { hostelNo: parseInt(singleDest), rollNos: singleRollNos } },
      });
      toast.success('Transfer submitted for approval');
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  // ── bulk submit ──
  const submitBulk = async () => {
    if (!subject || !description) { toast.error('Subject and Description required'); return; }
    const valid = groups.filter(g => g.rollNos.length > 0 && g.destHostelNo);
    if (!valid.length) { toast.error('Each group needs students and a destination'); return; }
    setLoading(true);
    let ok = 0, fail = 0;
    for (const g of valid) {
      try {
        await axios({
          method: 'POST',
          url: import.meta.env.VITE_BASE_URL + '/HA/applications/bulk-hostel-change',
          withCredentials: true,
          data: { subject, description, tag: 'hostel-transfer', extraData: { hostelNo: parseInt(g.destHostelNo), rollNos: g.rollNos } },
        });
        ok++;
      } catch { fail++; }
    }
    setLoading(false);
    if (ok) { toast.success(`${ok} group(s) submitted`); resetForm(); }
    if (fail) toast.error(`${fail} group(s) failed`);
  };

  // ── group helpers ──
  const addGroup = () => setGroups(p => [...p, emptyGroup()]);
  const removeGroup = id => setGroups(p => p.filter(g => g.id !== id));
  const updateGroup = (id, patch) => setGroups(p => p.map(g => g.id === id ? { ...g, ...patch } : g));

  const toggleStudent = (groupId, rollNo) => {
    setGroups(p => p.map(g => {
      if (g.id !== groupId) return g;
      const has = g.rollNos.includes(rollNo);
      return { ...g, rollNos: has ? g.rollNos.filter(r => r !== rollNo) : [...g.rollNos, rollNo] };
    }));
  };

  const allAssigned = useMemo(() => new Set(groups.flatMap(g => g.rollNos)), [groups]);

  const filteredStudents = (g) => students.filter(s => {
    if (g.filterHostel && String(s.hostelNo) !== g.filterHostel) return false;
    if (g.filterYear && String(s.year) !== g.filterYear) return false;
    return true;
  });

  const selectAll = (groupId, list) =>
    setGroups(p => p.map(g => g.id !== groupId ? g : { ...g, rollNos: [...new Set([...g.rollNos, ...list.map(s => s.rollNo)])] }));

  const clearAll = (groupId) =>
    setGroups(p => p.map(g => g.id !== groupId ? g : { ...g, rollNos: [] }));

  const totalStudents = groups.reduce((a, g) => a + g.rollNos.length, 0);

  // ── render ──
  return (
    <>
      <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen py-10 px-4">
        <h1 className="text-3xl font-semibold mb-1">Hostel Transfer</h1>
        <p className="text-gray-600 mb-8 text-sm">Transfer one student or migrate an entire year-batch across hostels</p>

        <div className="w-full max-w-2xl">

          {/* ── Tab strip — visually attached to the form card ── */}
          <div className="flex bg-white rounded-t-xl border border-b-0 overflow-hidden">
            {['single', 'bulk'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); resetForm(); }}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors
                  ${mode === m
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 bg-gray-50'
                  }`}
              >
                {m === 'single' ? 'Single Transfer' : 'Bulk Transfer'}
              </button>
            ))}
          </div>

          {/* ── SINGLE MODE ── */}
          {mode === 'single' && (
            <div className="bg-white rounded-b-xl border border-t-0 px-8 py-6 flex flex-col gap-5">
              <p className="text-sm text-gray-500 -mb-1">Quick transfer — one or a few students to one hostel</p>

              <div className="flex flex-col gap-1.5">
                <Label>Roll No(s)</Label>
                <p className="text-xs text-gray-400">Type a roll number and press Enter or comma to confirm it as a tag</p>
                <ChipInput chips={singleRollNos} onChange={setSingleRollNos} placeholder="e.g. 22MCA001, then press Enter" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Destination Hostel</Label>
                <Select onValueChange={setSingleDest} value={singleDest}>
                  <SelectTrigger><SelectValue placeholder="Select hostel" /></SelectTrigger>
                  <SelectContent>
                    {hostels.map(h => (
                      <SelectItem key={h.hostelNo} value={String(h.hostelNo)}>H{h.hostelNo} — {h.hostelName} ({h.type})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Subject <span className="text-gray-400 font-normal text-xs">(short summary)</span></Label>
                <Input placeholder="e.g. Medical grounds transfer" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Detailed Reason</Label>
                <Textarea placeholder="Provide the full reason for this transfer…" value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              {/* Tracking banner near submit — not at the top */}
              <TrackingBanner />

              <div className="flex justify-end">
                <Button onClick={submitSingle} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-8">
                  {loading ? 'Submitting…' : 'Submit for Approval'}
                </Button>
              </div>
            </div>
          )}

          {/* ── BULK MODE — tab strip connects to a brief description row ── */}
          {mode === 'bulk' && (
            <div className="bg-white rounded-b-xl border border-t-0 px-6 py-3">
              <p className="text-sm text-gray-500">Multi-group year-end migration — each group goes to a different hostel</p>
            </div>
          )}
        </div>

        {/* Bulk mode form — cards below the tab card */}
        {mode === 'bulk' && (
          <div className="w-full max-w-2xl flex flex-col gap-4 mt-4">

            {/* Shared subject / description */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Transfer Details <span className="text-gray-400 font-normal text-sm">(applies to all groups)</span></CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Subject <span className="text-gray-400 font-normal text-xs">(short summary)</span></Label>
                  <Input placeholder="e.g. Year-end hostel reassignment 2025-26" value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Detailed Reason</Label>
                  <Textarea placeholder="Reason for bulk transfer…" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Groups */}
            {groups.map((group, idx) => {
              const filtered = filteredStudents(group);
              const destHostel = hostels.find(h => String(h.hostelNo) === group.destHostelNo);
              return (
                <Card key={group.id} className="border-2 border-blue-100">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center gap-2">
                        Group {idx + 1}
                        {destHostel && <span className="text-sm font-normal text-blue-600">→ H{destHostel.hostelNo} {destHostel.hostelName}</span>}
                        {group.rollNos.length > 0 && <span className="text-sm font-normal text-gray-400">({group.rollNos.length} selected)</span>}
                      </CardTitle>
                      {groups.length > 1 && (
                        <Button size="sm" variant="ghost" className="text-red-500 h-7 text-xs" onClick={() => removeGroup(group.id)}>Remove</Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {/* Destination */}
                    <div className="flex flex-col gap-1">
                      <Label>Destination Hostel</Label>
                      <Select onValueChange={val => updateGroup(group.id, { destHostelNo: val })} value={group.destHostelNo}>
                        <SelectTrigger><SelectValue placeholder="Where are they going?" /></SelectTrigger>
                        <SelectContent>
                          {hostels.map(h => (
                            <SelectItem key={h.hostelNo} value={String(h.hostelNo)}>H{h.hostelNo} — {h.hostelName} ({h.type})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs text-gray-500">Filter by Source Hostel</Label>
                        <Select onValueChange={val => updateGroup(group.id, { filterHostel: val === 'all' ? '' : val })} value={group.filterHostel || 'all'}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Hostels</SelectItem>
                            {hostels.map(h => <SelectItem key={h.hostelNo} value={String(h.hostelNo)}>H{h.hostelNo} {h.hostelName}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs text-gray-500">Filter by Year</Label>
                        <Select onValueChange={val => updateGroup(group.id, { filterYear: val === 'all' ? '' : val })} value={group.filterYear || 'all'}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {[1, 2, 3, 4].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Student picker */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs text-gray-500">{filtered.length} student{filtered.length !== 1 ? 's' : ''} match filter</Label>
                        <div className="flex gap-2">
                          <button className="text-xs text-blue-600 hover:underline" onClick={() => selectAll(group.id, filtered)}>Select All</button>
                          <span className="text-gray-300">|</span>
                          <button className="text-xs text-gray-500 hover:underline" onClick={() => clearAll(group.id)}>Clear</button>
                        </div>
                      </div>
                      <div className="border rounded-md p-2 max-h-44 overflow-y-auto grid grid-cols-2 gap-1">
                        {filtered.length === 0 && <p className="text-xs text-gray-400 col-span-2 text-center py-4">No students match — adjust filters above</p>}
                        {filtered.map(s => {
                          const selected = group.rollNos.includes(s.rollNo);
                          const takenElsewhere = !selected && allAssigned.has(s.rollNo);
                          return (
                            <div
                              key={s.rollNo}
                              onClick={() => !takenElsewhere && toggleStudent(group.id, s.rollNo)}
                              className={`text-xs p-1 rounded border flex justify-between items-center transition-colors
                                ${takenElsewhere ? 'opacity-40 cursor-not-allowed bg-gray-100'
                                  : selected ? 'bg-blue-100 border-blue-400 cursor-pointer'
                                  : 'hover:bg-gray-50 cursor-pointer'}`}
                            >
                              <span className="font-mono">{s.rollNo}</span>
                              <span className="text-gray-400 truncate max-w-[90px]">{s.firstName} {s.lastName?.[0]}.</span>
                              {takenElsewhere && <span className="text-orange-400 ml-1" title="Assigned to another group">↗</span>}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Or add manually:
                        <Input
                          className="mt-1 h-7 text-xs"
                          placeholder="22MCA010, 22MCA011 …"
                          onBlur={e => {
                            const extras = e.target.value.split(',').map(r => r.trim()).filter(Boolean);
                            setGroups(p => p.map(g => g.id !== group.id ? g : { ...g, rollNos: [...new Set([...g.rollNos, ...extras])] }));
                            e.target.value = '';
                          }}
                        />
                      </p>
                    </div>

                    {/* Selected chips */}
                    {group.rollNos.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {group.rollNos.map(r => (
                          <span key={r} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            {r}
                            <button onClick={() => toggleStudent(group.id, r)} className="hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Add group + summary toggle */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={addGroup} className="border-dashed border-blue-400 text-blue-600">
                + Add Group
              </Button>
              {totalStudents > 0 && (
                <button onClick={() => setShowSummary(p => !p)} className="text-sm text-blue-600 underline">
                  {showSummary ? 'Hide' : 'Show'} summary ({totalStudents} students)
                </button>
              )}
            </div>

            {/* Pre-submit summary table */}
            {showSummary && <SummaryTable groups={groups} students={students} hostels={hostels} />}

            {/* Tracking banner near submit */}
            <TrackingBanner />

            <div className="flex justify-end">
              <Button
                onClick={submitBulk}
                disabled={loading || totalStudents === 0}
                className="bg-blue-600 hover:bg-blue-500 px-8"
              >
                {loading ? 'Submitting…'
                  : `Submit ${groups.filter(g => g.rollNos.length && g.destHostelNo).length} Group(s) — ${totalStudents} Students`}
              </Button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
// Bug fix by Ravi: Bug 5 - Smart room generation logic was missing; admin had to manually prepare CSV
// Redesigned to floor-based generation: each floor gets its own prefix (floor 1 → 1XX, floor 2 → 2XX, etc.)
// Old start/end range approach was commented out below — it assumed continuous numbering which breaks for real hostels
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function RoomGenerator() {
  // Basic config
  const [hostelNo, setHostelNo] = useState('');
  const [block, setBlock] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [roomsPerFloor, setRoomsPerFloor] = useState('');
  const [capacity, setCapacity] = useState('2');
  const [startingPrefix, setStartingPrefix] = useState('1'); // floor 1 → prefix 1 → rooms 101-1XX

  // Per-floor override mode
  const [advancedMode, setAdvancedMode] = useState(false);
  const [floorConfigs, setFloorConfigs] = useState([]); // [{ prefix, count }]

  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bug fix by Ravi: Bug 5 - Floor-based generation: each floor gets prefix*100 + room index
  // e.g. floor 1 (prefix 1) → rooms 101..130, floor 2 (prefix 2) → 201..230, etc.
  // Old approach (single start→end range) is preserved as a comment below for reference:
  // for (let roomNo = start; roomNo <= end; roomNo++) { const floorNo = Math.floor(roomNo/100) - 1; ... }
  const generatePreview = () => {
    const hNo = parseInt(hostelNo);
    const cap = parseInt(capacity) || 2;
    const prefix0 = parseInt(startingPrefix) || 1;

    if (!hNo || !block) {
      toast.error('Hostel No and Block are required');
      return;
    }

    const rooms = [];

    if (advancedMode) {
      // Per-floor config: each entry has { prefix, count }
      if (floorConfigs.length === 0) {
        toast.error('Add at least one floor config');
        return;
      }
      floorConfigs.forEach((fc, idx) => {
        const prefix = parseInt(fc.prefix);
        const count = parseInt(fc.count);
        if (isNaN(prefix) || isNaN(count) || count < 1) return;
        for (let room = 1; room <= count; room++) {
          rooms.push({
            hostelNo: hNo,
            block,
            floorNo: idx,           // ground=0, 1st=1, ...
            roomNo: prefix * 100 + room,
            maxOccupancy: cap,
          });
        }
      });
    } else {
      const floors = parseInt(totalFloors);
      const perFloor = parseInt(roomsPerFloor);
      if (isNaN(floors) || isNaN(perFloor) || floors < 1 || perFloor < 1) {
        toast.error('Enter valid Total Floors and Rooms per Floor');
        return;
      }
      for (let f = 0; f < floors; f++) {
        const prefix = prefix0 + f;
        for (let room = 1; room <= perFloor; room++) {
          rooms.push({
            hostelNo: hNo,
            block,
            floorNo: f,             // ground=0, 1st=1, ...
            roomNo: prefix * 100 + room,
            maxOccupancy: cap,
          });
        }
      }
    }

    if (rooms.length === 0) {
      toast.error('No rooms generated — check your config');
      return;
    }
    setPreview(rooms);
    toast.success(`${rooms.length} room(s) generated — review below before uploading`);
  };

  // Bug fix by Ravi: Bug 5 - Bulk-creates all generated rooms via existing POST /SA/addroom
  const bulkCreate = async () => {
    if (preview.length === 0) { toast.error('Generate rooms first'); return; }
    setLoading(true);
    let success = 0;
    let failed = 0;
    for (const room of preview) {
      try {
        await axios({ method: 'POST', url: import.meta.env.VITE_BASE_URL + '/SA/addroom', data: room, withCredentials: true });
        success++;
      } catch {
        failed++;
      }
    }
    setLoading(false);
    setPreview([]);
    toast.success(`Done: ${success} created, ${failed} skipped (already exist)`);
  };

  const addFloorConfig = () => {
    const nextPrefix = floorConfigs.length === 0
      ? (parseInt(startingPrefix) || 1)
      : (parseInt(floorConfigs[floorConfigs.length - 1].prefix) || 1) + 1;
    setFloorConfigs(prev => [...prev, { prefix: String(nextPrefix), count: roomsPerFloor || '30' }]);
  };

  const updateFloorConfig = (idx, field, val) => {
    setFloorConfigs(prev => prev.map((fc, i) => i === idx ? { ...fc, [field]: val } : fc));
  };

  const removeFloorConfig = (idx) => {
    setFloorConfigs(prev => prev.filter((_, i) => i !== idx));
  };

  // Group preview by floor for display
  const previewByFloor = preview.reduce((acc, r) => {
    const key = `Floor ${r.floorNo} (prefix ${Math.floor(r.roomNo / 100)})`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <>
      <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen py-10">
        <h1 className="text-3xl font-semibold">Smart Room Generator</h1>
        <p className="text-gray-500 mb-6">Floor-based generation — each floor gets its own room number prefix</p>

        <Card className="w-[640px]">
          <CardHeader>
            <CardTitle>Hostel Structure</CardTitle>
            <CardDescription>
              Floor 1 → rooms {(parseInt(startingPrefix)||1)*100 + 1}–{(parseInt(startingPrefix)||1)*100 + (parseInt(roomsPerFloor)||30)},
              Floor 2 → {((parseInt(startingPrefix)||1)+1)*100 + 1}–{((parseInt(startingPrefix)||1)+1)*100 + (parseInt(roomsPerFloor)||30)}, …
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label>Hostel No</Label>
                <Input type="number" placeholder="e.g. 11" value={hostelNo} onChange={e => setHostelNo(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Block</Label>
                <Input placeholder="e.g. A" value={block} onChange={e => setBlock(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Starting Prefix</Label>
                <Input type="number" placeholder="e.g. 1 → rooms start at 101" value={startingPrefix} onChange={e => setStartingPrefix(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Capacity per Room</Label>
                <Input type="number" placeholder="e.g. 2" value={capacity} onChange={e => setCapacity(e.target.value)} />
              </div>

              {!advancedMode && (
                <>
                  <div className="flex flex-col gap-1">
                    <Label>Total Floors</Label>
                    <Input type="number" placeholder="e.g. 6" value={totalFloors} onChange={e => setTotalFloors(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Rooms per Floor</Label>
                    <Input type="number" placeholder="e.g. 30" value={roomsPerFloor} onChange={e => setRoomsPerFloor(e.target.value)} />
                  </div>
                </>
              )}
            </div>

            {/* Advanced mode toggle */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="advMode"
                checked={advancedMode}
                onChange={e => { setAdvancedMode(e.target.checked); setFloorConfigs([]); setPreview([]); }}
              />
              <label htmlFor="advMode" className="text-sm text-gray-600 cursor-pointer">
                Advanced: different room count per floor
              </label>
            </div>

            {/* Per-floor config table */}
            {advancedMode && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Floor Configs</span>
                  <Button size="sm" onClick={addFloorConfig} className="bg-blue-600 hover:bg-blue-500 text-xs">+ Add Floor</Button>
                </div>
                {floorConfigs.length === 0 && (
                  <p className="text-xs text-gray-400">No floors added yet. Click "+ Add Floor".</p>
                )}
                {floorConfigs.map((fc, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2 text-sm">
                    <span className="w-20 text-gray-500">Floor {idx} {idx === 0 ? '(G)' : ''}</span>
                    <div className="flex flex-col gap-0">
                      <Label className="text-xs text-gray-400">Prefix</Label>
                      <Input className="w-20 h-7 text-xs" type="number" value={fc.prefix} onChange={e => updateFloorConfig(idx, 'prefix', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-0">
                      <Label className="text-xs text-gray-400">Room count</Label>
                      <Input className="w-24 h-7 text-xs" type="number" value={fc.count} onChange={e => updateFloorConfig(idx, 'count', e.target.value)} />
                    </div>
                    <span className="text-xs text-gray-400 mt-4">
                      → {parseInt(fc.prefix)*100+1}–{parseInt(fc.prefix)*100+(parseInt(fc.count)||0)}
                    </span>
                    <Button size="sm" variant="ghost" className="text-red-500 mt-4 h-6 px-2 text-xs" onClick={() => removeFloorConfig(idx)}>✕</Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button onClick={generatePreview} className="bg-blue-600 hover:bg-blue-500">Preview Rooms</Button>
              {preview.length > 0 && (
                <Button onClick={bulkCreate} disabled={loading} className="bg-green-600 hover:bg-green-500">
                  {loading ? 'Creating...' : `Create ${preview.length} Rooms`}
                </Button>
              )}
              {preview.length > 0 && (
                <Button variant="outline" onClick={() => setPreview([])}>Clear</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview grouped by floor */}
        {Object.keys(previewByFloor).length > 0 && (
          <Card className="w-[640px] mt-6">
            <CardHeader>
              <CardTitle>Preview — {preview.length} rooms across {Object.keys(previewByFloor).length} floor(s)</CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              {Object.entries(previewByFloor).map(([floorLabel, rooms]) => (
                <div key={floorLabel} className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{floorLabel} — {rooms.length} rooms</p>
                  <div className="grid grid-cols-6 gap-1">
                    {rooms.map((r, i) => (
                      <div key={i} className="border rounded p-1 text-center text-xs">
                        <div className="font-semibold">{r.roomNo}</div>
                        <div className="text-blue-500">×{r.maxOccupancy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

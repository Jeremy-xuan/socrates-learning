export default function ClassroomPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">上课界面</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="mr-2">选择老师：</label>
          <select className="border rounded px-2 py-1"><option>紅莉栖</option><option>公生</option><option>蕾娜</option></select>
        </div>
        <div className="h-96 border rounded p-4 mb-4 bg-gray-50 overflow-y-auto">
          <p className="text-gray-500">等待对话开始...</p>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="输入你的回答..." className="flex-1 border rounded px-4 py-2" />
          <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded">发送</button>
        </div>
      </div>
    </div>
  );
}
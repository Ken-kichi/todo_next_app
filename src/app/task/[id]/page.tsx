'use client';

import Layout from '@/components/Layout';
import { Task } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DetailTaskPage() {
  const router = useRouter();
  const params = useParams();
  const token = Cookies.get('token');
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task>();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const { id } = params;

    axios
      .get(`http://localhost:8000/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        setTask(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setTask({});
        } else if (error.response && error.response.status === 401) {
          router.push('/');
        } else {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-gray-500 text-lg">Leading...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-700">タスク詳細</h1>
        <label className="flex items-center cursor-pointer">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="bg-green-600 text-white py-2 px-4 rounded-md mr-2 hover:bg-green-700"
          >
            {isEditMode ?  'Detail Mode':'Edit Mode' }
          </button>
        </label>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        {isEditMode ? (
          // 編集モード
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">タイトル</label>
              <input
                type="text"
                defaultValue={task.title}
                className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">説明</label>
              <textarea
                defaultValue={task.description}
                className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Update
              </button>
            </div>
          </div>
        ) : (
          // 通常表示モード
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{task.title}</h2>
            <p className="text-gray-700 mb-4">{task.description}</p>
            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/task/${task.id}`)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

'use client';

import Layout from '@/components/Layout';
import { Task } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const token = Cookies.get('token');
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get('http://localhost:8000/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setTasks([]);
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
      {tasks?.length > 0 ? (
        tasks?.map((task: Task, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{task.title}</h2>
            <p className="text-gray-700 mb-4">{task.description}</p>
            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/task/${task.id}`)} // 詳細ページにリダイレクト
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                詳細
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>タスクがありません。</p>
      )}
    </Layout>
  );
}

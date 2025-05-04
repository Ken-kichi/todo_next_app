'use client';

import Layout from '@/components/Layout';
import Spiner from '@/components/Spiner';
import { TaskProps } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const router = useRouter();
  const token = Cookies.get('token');
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskProps[]>();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get(`${API_BASE_URL}/tasks`, {
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
          router.push('/tasks');
        } else {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, token,API_BASE_URL]);

  if (loading) {
    return <Spiner />;
  }

  return (
    <Layout>
      <div className="flex justify-end items-center mb-4 mr-6">
        <button
          onClick={() => router.push('tasks/add')}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {tasks && tasks.length > 0 ? (
        tasks?.map((task: TaskProps, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{task.title}</h2>
            <div className="flex justify-between items-center">
              <p className="text-gray-700 ">
                {task?.completed ? (
                  <span className="rounded-full bg-green-600 px-3 py-1.5 font-medium text-white">
                    Completed
                  </span>
                ) : (
                  <span className="rounded-full bg-red-600 px-3 py-1.5 font-medium text-white">
                    Incomplete
                  </span>
                )}
              </p>
              <button
                onClick={() => router.push(`/tasks/${task.id}`)} // 詳細ページにリダイレクト
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Detail
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Task not found</p>
      )}
    </Layout>
  );
}

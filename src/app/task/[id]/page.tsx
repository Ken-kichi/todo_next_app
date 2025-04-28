'use client';

import Layout from '@/components/Layout';
import { Task } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DetailTaskPage() {
  const router = useRouter();
  const params = useParams();
  const token = Cookies.get('token');
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task>();
  const [isEditMode, setIsEditMode] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<Task>();

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
        setValue('title', res.data.title);
        setValue('description', res.data.description);
        setValue('completed', res.data.completed);
        setValue('user_id', res.data.user_id);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setTask(undefined);
        } else if (error.response && error.response.status === 401) {
          router.push('/');
        } else {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, token, params, setValue]);

  const onSubmit = async () => {
    const { id } = params;
    try {
      await axios.put(`http://localhost:8000/tasks/${id}`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      alert('更新に成功しました');
      router.push('/');
    } catch (error) {
      console.error('更新に失敗しました', error);
    }
  };

  const onDelete = async () => {
    const result = confirm('Are you delete this task ?');
    if (result) {
      const { id } = params;
      try {
        await axios.delete(`http://localhost:8000/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        alert('削除に成功しました');
        router.push('/');
      } catch (error) {
        console.error('削除に失敗しました', error);
      }
    }
  };

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

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isEditMode}
            onChange={() => setIsEditMode(!isEditMode)}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
          <span className="ml-3 text-2xl font-medium text-gray-700">
            {isEditMode ? 'Edit Mode' : 'Detail Mode'}
          </span>
        </label>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        {isEditMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700">タイトル</label>
              <input
                {...register('title')}
                type="text"
                className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700">説明</label>
              <textarea
                {...register('description')}
                className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">ステータス</label>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('completed')} className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
                <span className="ml-3 text-xl font-medium text-gray-700">
                  {watch('completed') ? 'Completed' : 'Incomplete'}
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{task?.title}</h2>
            <p className="text-gray-700 mb-4">{task?.description}</p>
            <p className="text-gray-700 mb-4">
              ステータス:{' '}
              {task?.completed ? (
                <span className="rounded-full bg-green-600 px-3 py-1.5 font-medium text-white">
                  完了
                </span>
              ) : (
                <span className="rounded-full bg-red-600 px-3 py-1.5 font-medium text-white">
                  未完了
                </span>
              )}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => onDelete()}
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

'use client';

import Layout from '@/components/Layout';
import { Task } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AddTaskPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const token = Cookies.get('token');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Task>();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [token, router]);

  const onSubmit = async (data: Task) => {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null;
    const token = Cookies.get('token');

    if (!user || !token) {
      router.push('/login');
      return;
    }

    setValue('user_id', user.id);
    setValue('completed', false);

    try {
      await axios.post('http://localhost:8000/tasks', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      reset();
      router.push('/');
    } catch (error: any) {
      if (error.response?.status === 401) {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
      } else {
        console.error('Failed to create task:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-scree">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Add Task</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required.' })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                {...register('description')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

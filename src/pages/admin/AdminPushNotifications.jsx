import { useState } from 'react';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import { FaInfoCircle } from 'react-icons/fa';
import { LoaderCircleIcon } from 'lucide-react'

const AdminPushNotifications = () => {
   const [formData, setFormData] = useState({
      title: '',
      body: '',
      topic: 'all-users',
   });
   const [loading, setLoading] = useState(false);

   const topics = [
      { id: 'all-users', name: 'All Users', description: 'Send to every registered device' },
      { id: 'promotions', name: 'Promotions', description: 'Send to users opted into promos' },
   ];

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.title || !formData.body) {
         return toast.error('Please fill in both title and body');
      }

      setLoading(true);
      try {
         const response = await axios.post('/api/v1/push-notifications/send', formData, {
            withCredentials: true,
         });

         if (response.data.status === 'success') {
            toast.success('Push notification sent successfully!');
            setFormData({ title: '', body: '', topic: 'all-users', route: '' });
         }
      } catch (error) {
         console.error('Push error:', error);
         toast.error(error.response?.data?.message || 'Failed to send notification');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div>
         <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
         <div className="px-6 pt-6 pb-4 bg-white rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                           Notification Title
                        </label>
                        <input
                           type="text"
                           name="title"
                           value={formData.title}
                           onChange={handleChange}
                           placeholder="e.g. 🎉 Flash Sale Alert!"
                           className="w-full px-4 py-2 border border-slate-200 mb-2.5 rounded-md text-sm focus:ring-1 focus:ring-primary-light focus:border-transparent transition-all outline-none"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                           Message Body
                        </label>
                        <textarea
                           name="body"
                           value={formData.body}
                           onChange={handleChange}
                           placeholder="Write your message here..."
                           rows="5"
                           className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-1 text-sm focus:ring-primary-light focus:border-transparent transition-all outline-none resize-none"
                        ></textarea>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                           Target Audience (Topic)
                        </label>
                        <div className="space-y-3">
                           {topics.map((t) => (
                              <label
                                 key={t.id}
                                 className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.topic === t.id
                                    ? 'border-primary-lighring-primary-light bg-orange-50 shadow-sm'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                              >
                                 <input
                                    type="radio"
                                    name="topic"
                                    value={t.id}
                                    checked={formData.topic === t.id}
                                    onChange={handleChange}
                                    className="hidden"
                                 />
                                 <div className="flex-1">
                                    <p className={`font-medium ${formData.topic === t.id ? 'text-primary-light' : 'text-slate-700'}`}>
                                       {t.name}
                                    </p>
                                    <p className="text-sm text-slate-500">{t.description}</p>
                                 </div>
                                 {formData.topic === t.id && (
                                    <div className="w-5 h-5 bg-primary-lighring-primary-light rounded-full flex items-center justify-center">
                                       <div className="w-2 h-2 bg-primary-light rounded-full"></div>
                                    </div>
                                 )}
                              </label>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-4 flex justify-center md:justify-end">
                  <button
                     type="submit"
                     disabled={loading}
                     className={`flex items-center w-full md:w-fit justify-center md:justify-start gap-2 px-6 py-2 bg-primary-light text-white font-semibold text-sm rounded-md transition-all hover:bg-primary-light/90 cursor-pointer`}
                  >
                     {
                        loading ? (
                           <>
                              <LoaderCircleIcon className='animate-spin' size={16} />
                           </>
                        ) : (
                        <>
                           Send Notification
                        </>
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default AdminPushNotifications;

"use client";

import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
// استيراد الأيقونات
import { HiOutlineMail } from "react-icons/hi";
import { FaPaperPlane } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("الرجاء إدخال بريد إلكتروني صحيح", {
        position: "top-right",
        autoClose: 3000,
        rtl: true,
      });
      return;
    }

    const result = await Swal.fire({
      title: "تأكيد الإرسال",
      text: `هل تريد إرسال الدعوة إلى ${email}؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "نعم، أرسل",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
      customClass: {
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mx-2",
        cancelButton: "bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mx-2",
      }
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);

      try {
        const response = await fetch('http://localhost:3000/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ to: email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "فشل في إرسال البريد");
        }

        toast.succesر Townhalls(`تم إرسال دعوة بنجاح إلى ${email}`, {
          position: "top-right",
          autoClose: 5000,
          rtl: true,
        });

        setEmail("");
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("حدث خطأ أثناء الإرسال", {
          position: "top-right",
          autoClose: 3000,
          rtl: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          قم بإرسال دعوة لصديقك
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          ادخل البريد الالكتروني الخاص به
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2 text-right"
            >
              البريد الإلكتروني
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="example@domain.com"
                dir="ltr"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } transition duration-200 flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <ImSpinner8 className="animate-spin h-5 w-5" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <FaPaperPlane className="h-5 w-5" />
                إرسال الدعوة
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
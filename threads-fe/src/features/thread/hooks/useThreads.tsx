import { IThreadPost } from "@/interfaces/thread";
import { API } from "@/libs/api";
import { GET_THREADS } from "@/stores/rootReducer";
import { RootState } from "@/stores/types/rootState";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useThreads() {
  const dispatch = useDispatch();
  const threads = useSelector((state: RootState) => state.thread);
  const [form, setForm] = useState<IThreadPost>({
    content: "",
    image: "",
  });

  async function getThreads() {
    const response = await API.get(`/threads?limit=5`);
    dispatch(GET_THREADS(response.data));
  }

  async function handlePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // console.log(form);
    console.log("test image", form.image);

    const formData = new FormData();
    formData.append("content", form.content);
    formData.append("image", form.image as File);

    const response = await API.post("/thread", formData);
    console.log("berhasil menambahkan thread", response);
    getThreads();
  }

  useEffect(() => {
    getThreads();
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = event.target;
    console.log("testing", name, value, files);

    if (files) {
      console.log("masuk file");
      setForm({
        ...form,
        [name]: files[0],
      });
    } else {
      console.log("masuk biasa");
      setForm({
        ...form,
        [name]: value,
      });
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  return { handleChange, handlePost, fileInputRef, handleButtonClick, threads };
}

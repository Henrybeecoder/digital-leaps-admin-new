import { useEffect, useState } from 'react';
import '../../../styles/courses.css';
import CourseInfo from './CourseInfo';
import Curriculum from './Curriculum';
import Faqs from './Faqs';
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/fire';
import { Loading, LoadingBlur } from '../../../components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getDurationFromDates,
  removeUndefined,
  timeFromDate,
  timeToDate,
} from '../../../utils/helper';
import { CourseForms, CourseType } from '../../../../types';
import { uploadFile } from '../../../utils/api';
import { nanoid } from 'nanoid';
import { FaqS } from '../../../utils/z/course';
import { useStore } from '../../../store';

const CourseForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const courseId = params?.courseId;
  const edit = params['*']?.split('/').includes('edit');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [{ courseInfo, curriculum, faqs }, setStore] = useState<
    Partial<CourseForms>
  >({});

  const draftDetails = useStore((state) => state.details);

  useEffect(() => {
    if (!courseId) return;

    setFetching(true);

    if (!edit) {
      // try {
      //   setStore({
      //     ...draftDetails,
      //     courseInfo: {
      //       ...draftDetails.courseInfo,
      //       startDate: new Date(draftDetails.courseInfo?.startDate || ''),
      //       endDate: new Date(draftDetails.courseInfo?.endDate || ''),
      //     } as any,
      //   });
      //   setFetching(false);
      // } catch (err) {
      //   console.log(err);
      setFetching(false);
      // }
    } else {
      (async () => {
        try {
          const res = await getDoc(doc(db, 'courses', courseId));
          const {
            chapters,
            faq,
            startDate,
            endDate,
            lectureStartTime,
            lectureEndTime,
            imageLink,
            price,
            totalNumberOfLectures,
            ...rest
          } = res ? res.data() : ({} as any);

          setStore({
            courseInfo: {
              ...rest,
              lectureStartTime: timeToDate(lectureStartTime),
              lectureEndTime: timeToDate(lectureEndTime),
              startDate: startDate.toDate(),
              endDate: endDate.toDate(),
              cover: { serverUrl: imageLink, file: null },
              price: `${price}`,
              totalNumberOfLectures: `${totalNumberOfLectures}`,
            },
            curriculum: { chapters },
            faqs: { questions: faq },
          });

          setFetching(false);
        } catch (err) {
          setFetching(false);
          toast.error('failed to fetch data');
        }
      })();
    }
  }, [courseId, edit]);

  const [pageKey, setPageKey] = useState<1 | 2 | 3>(
    // courseInfo && curriculum && faqs ? 3 : courseInfo && curriculum ? 2 : 1
    1
  );

  const saveNewCourse = async (faqs: FaqS) => {
    if (!courseInfo || !curriculum || !faqs) return;

    const id = nanoid();

    try {
      setLoading(true);
      const payload = removeUndefined({
        id,
        about: courseInfo.about,
        categoryId: courseInfo.categoryId,
        chapters: curriculum.chapters,
        description: courseInfo.description,
        startDate: Timestamp.fromDate(courseInfo.startDate),
        endDate: Timestamp.fromDate(courseInfo.endDate),
        faq: faqs.questions,
        instructor: courseInfo.instructor,
        instructorId: courseInfo.instructor?.id,
        price: Number(courseInfo.price),
        skills: courseInfo.skills,
        title: courseInfo.title,
        createdAt: Timestamp.now(),
        requirements: courseInfo.requirements,
        level: courseInfo.level,
        durationInWeeks: getDurationFromDates(
          courseInfo.startDate,
          courseInfo.endDate
        ),
        links: { facebook: '', linkedin: '', youtube: '' },
        rating: 0,
        learningObjectives: courseInfo.learningObjectives,
        courseLanguage: courseInfo.courseLanguage,
        coursePlatform: courseInfo.coursePlatform,
        lectureStartTime: timeFromDate(courseInfo.lectureStartTime),
        lectureEndTime: timeFromDate(courseInfo.lectureEndTime),
        totalNumberOfLectures: Number(courseInfo.totalNumberOfLectures),
        imageLink: courseInfo.cover.file
          ? await uploadFile(courseInfo.cover.file, 'course-images/' + nanoid())
          : undefined,
        lectureDays: courseInfo.lectureDays,
        courseCertificate: courseInfo.courseCertificate,
        instructor2: courseInfo.instructor2,
        instructor2Id: courseInfo.instructor2?.id,
        isFeatured: courseInfo.isFeatured || false,
        isHidden: false,
      } as Omit<CourseType, 'id'>);

      const docRef = doc(db, 'courses', id);

      await setDoc(docRef, payload);
      setLoading(false);
      toast.success('saved course');
      navigate(`/courses/course-details/${id}`);
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  const updateCourse = async (faqs: FaqS) => {
    if (!courseId || !courseInfo || !curriculum || !faqs) return;

    try {
      setLoading(true);
      const payload = removeUndefined({
        about: courseInfo.about,
        categoryId: courseInfo.categoryId,
        chapters: curriculum.chapters,
        description: courseInfo.description,
        startDate: Timestamp.fromDate(courseInfo.startDate),
        endDate: Timestamp.fromDate(courseInfo.endDate),
        faq: faqs.questions,
        instructor: courseInfo.instructor,
        instructorId: courseInfo.instructor?.id,
        price: Number(courseInfo.price),
        skills: courseInfo.skills,
        title: courseInfo.title,
        modifiedAt: Timestamp.now(),
        requirements: courseInfo.requirements,
        level: courseInfo.level,
        durationInWeeks: getDurationFromDates(
          courseInfo.startDate,
          courseInfo.endDate
        ),
        links: { facebook: '', linkedin: '', youtube: '' },
        rating: 0,
        learningObjectives: courseInfo.learningObjectives,
        courseLanguage: courseInfo.courseLanguage,
        coursePlatform: courseInfo.coursePlatform,
        lectureStartTime: timeFromDate(courseInfo.lectureStartTime),
        lectureEndTime: timeFromDate(courseInfo.lectureEndTime),
        totalNumberOfLectures: Number(courseInfo.totalNumberOfLectures),
        imageLink: courseInfo.cover.file
          ? await uploadFile(
              courseInfo.cover.file,
              'course-images/' +
                (courseInfo.cover.serverUrl
                  ? new URL(courseInfo.cover.serverUrl).pathname
                      .split('/')[5]
                      .split('%2F')[1]
                  : nanoid())
            )
          : undefined,
        lectureDays: courseInfo.lectureDays,
        courseCertificate: courseInfo.courseCertificate,
        instructor2: courseInfo.instructor2,
        instructor2Id: courseInfo.instructor2?.id,
        isFeatured: courseInfo.isFeatured,
      } as Partial<Omit<CourseType, 'id'>>);
      // console.log(payload);

      await updateDoc(doc(db, 'courses', courseId), payload);
      setLoading(false);
      toast.success('updated');
      navigate(-1);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error('something went wrong');
    }
  };

  const saveCourse = (faqs: FaqS) => {
    if (edit) {
      updateCourse(faqs);
    } else {
      saveNewCourse(faqs);
    }
  };

  const fillForm = (
    name: 'courseInfo' | 'curriculum' | 'faqs',
    payload?: any
  ) => {
    switch (name) {
      case 'courseInfo':
        setStore((x) => ({ ...x, courseInfo: payload }));
        setPageKey(2);
        break;
      case 'curriculum':
        setStore((x) => ({ ...x, curriculum: payload }));
        setPageKey(3);
        break;
      case 'faqs':
        // setStore((x) => ({ ...x, faqs: payload }));
        saveCourse(payload);
        break;
    }
  };

  const setDetails = useStore((state) => state.setDetails);

  const saveAsDraft = (faqs: FaqS) => {
    // setDetails({
    //   courseInfo: { ...(courseInfo as any), cover: {} },
    //   curriculum,
    //   faqs,
    // });
    toast.success('saved as draft');
    navigate(-1);
  };

  const renderPage = {
    1: <CourseInfo fillForm={fillForm} courseInfo={courseInfo} />,
    2: (
      <Curriculum
        fillForm={fillForm}
        curriculum={curriculum}
        setPageKey={setPageKey}
      />
    ),
    3: (
      <Faqs
        fillForm={fillForm}
        faqs={faqs}
        setPageKey={setPageKey}
        saveAsDraft={saveAsDraft}
      />
    ),
  };

  if (fetching) return <Loading />;

  return (
    <>
      {loading && <LoadingBlur />}
      <>{renderPage[pageKey]}</>
    </>
  );
};

export default CourseForm;

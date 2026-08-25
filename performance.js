/* =====================================================
   PERFORMANCE PAGE
   خواندن جلسات مطالعه از localStorage
===================================================== */


/* =====================================================
   DELETE CONFIRM MODAL STATE
===================================================== */

let lessonToDelete = null;


/* =====================================================
   باز کردن پنجره تأیید
===================================================== */

function openDeleteConfirm(lessonKey) {

    lessonToDelete = lessonKey;


    const overlay =
        document.getElementById(
            "deleteConfirmOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.add("show");


    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

}


/* =====================================================
   بستن پنجره تأیید
===================================================== */

function closeDeleteConfirm() {

    const overlay =
        document.getElementById(
            "deleteConfirmOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.remove("show");


    lessonToDelete = null;

}


/* =====================================================
   حذف واقعی درس
===================================================== */

function deleteSelectedLesson() {

    if (!lessonToDelete) {
        return;
    }


    const sessions =
        JSON.parse(
            localStorage.getItem(
                "studySessions"
            )
        ) || [];


    const remainingSessions =
        sessions.filter(
            session => {

                const key =
                    session.subject ||
                    session.subjectName ||
                    "unknown";


                return key !== lessonToDelete;

            }
        );


    localStorage.setItem(
        "studySessions",
        JSON.stringify(
            remainingSessions
        )
    );


    closeDeleteConfirm();


    /*
        صفحه دوباره بارگذاری می‌شود
        تا آمار و کارت‌ها هم آپدیت شوند.
    */

    location.reload();

}


/* =====================================================
   فعال کردن دکمه‌های سطل زباله
===================================================== */

function setupLessonDeleteButtons() {

    const deleteButtons =
        document.querySelectorAll(
            ".delete-lesson-btn-new"
        );


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const lessonKey =
                    button.dataset.lessonKey;


                if (!lessonKey) {
                    return;
                }


                /*
                    اینجا هنوز چیزی حذف نمی‌شود.
                    فقط مودال باز می‌شود.
                */

                openDeleteConfirm(
                    lessonKey
                );

            }
        );

    });

}


/* =====================================================
   تنظیم دکمه‌های مودال
===================================================== */

function setupDeleteModal() {


    const deleteConfirmCancel =
        document.getElementById(
            "deleteConfirmCancel"
        );


    const deleteConfirmSubmit =
        document.getElementById(
            "deleteConfirmSubmit"
        );


    const deleteConfirmOverlay =
        document.getElementById(
            "deleteConfirmOverlay"
        );


    /* -------------------------------------------------
       دکمه انصراف
    ------------------------------------------------- */

    if (deleteConfirmCancel) {

        deleteConfirmCancel.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeDeleteConfirm();

            }
        );

    }


    /* -------------------------------------------------
       دکمه حذف
    ------------------------------------------------- */

    if (deleteConfirmSubmit) {

        deleteConfirmSubmit.addEventListener(
            "click",
            event => {

                event.preventDefault();

                deleteSelectedLesson();

            }
        );

    }


    /* -------------------------------------------------
       کلیک بیرون پنجره
    ------------------------------------------------- */

    if (deleteConfirmOverlay) {

        deleteConfirmOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    deleteConfirmOverlay
                ) {

                    closeDeleteConfirm();

                }

            }
        );

    }


    /* -------------------------------------------------
       بستن با کلید Escape
    ------------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeDeleteConfirm();

            }

        }
    );

}


/* =====================================================
   PERFORMANCE PAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           دریافت جلسات ذخیره شده
        ================================================= */

        const sessions =
            JSON.parse(
                localStorage.getItem(
                    "studySessions"
                )
            ) || [];


        /* =================================================
           عناصر صفحه
        ================================================= */

        const totalStudyTime =
            document.getElementById(
                "totalStudyTime"
            );


        const completedLessons =
            document.getElementById(
                "completedLessons"
            );


        const activeDays =
            document.getElementById(
                "activeDays"
            );


        const activityList =
            document.getElementById(
                "activityList"
            );


        const lessonProgressList =
            document.getElementById(
                "lessonProgressList"
            );


        /* =================================================
           تنظیم مودال
        ================================================= */

        setupDeleteModal();


        /* =================================================
           اگر هنوز جلسه‌ای ثبت نشده
        ================================================= */

        if (sessions.length === 0) {


            if (totalStudyTime) {

                totalStudyTime.textContent =
                    "00:00:00";

            }


            if (completedLessons) {

                completedLessons.textContent =
                    "0";

            }


            if (activeDays) {

                activeDays.textContent =
                    "0";

            }


            if (activityList) {

                activityList.innerHTML = `
                    <div
                        class="empty-performance-new"
                    >
                        هنوز گزارشی ثبت نشده است
                    </div>
                `;

            }


            if (lessonProgressList) {

                lessonProgressList.innerHTML =
                    "";

            }


            if (
                typeof lucide !==
                "undefined"
            ) {

                lucide.createIcons();

            }


            return;

        }


        /* =================================================
           تبدیل زمان جلسه به ثانیه
        ================================================= */

        function sessionToSeconds(
            session
        ) {


            const hour =
                Number(
                    session.studyTime?.hour ||
                    0
                );


            const minute =
                Number(
                    session.studyTime?.minute ||
                    0
                );


            const second =
                Number(
                    session.studyTime?.second ||
                    0
                );


            return (
                hour * 3600 +
                minute * 60 +
                second
            );

        }


        /* =================================================
           فرمت زمان
        ================================================= */

        function formatTime(
            totalSeconds
        ) {


            const hours =
                Math.floor(
                    totalSeconds / 3600
                );


            const minutes =
                Math.floor(
                    (totalSeconds % 3600) /
                    60
                );


            const seconds =
                totalSeconds % 60;


            return [
                hours,
                minutes,
                seconds
            ]
                .map(
                    value =>
                        String(
                            value
                        ).padStart(
                            2,
                            "0"
                        )
                )
                .join(":");

        }


        /* =================================================
           مجموع زمان مطالعه
        ================================================= */

        const totalSeconds =
            sessions.reduce(
                (
                    total,
                    session
                ) => {

                    return (
                        total +
                        sessionToSeconds(
                            session
                        )
                    );

                },
                0
            );


        if (totalStudyTime) {

            totalStudyTime.textContent =
                formatTime(
                    totalSeconds
                );

        }


        /* =================================================
           تعداد درس‌های انجام شده
        ================================================= */

        if (completedLessons) {

            completedLessons.textContent =
                sessions.length;

        }


        /* =================================================
           تعداد روزهای فعال
        ================================================= */

        const uniqueDays =
            new Set(
                sessions.map(
                    session =>
                        session.day
                )
            );


        if (activeDays) {

            activeDays.textContent =
                uniqueDays.size;

        }


        /* =================================================
           آخرین فعالیت‌ها
        ================================================= */

        if (activityList) {


            const latestSessions =
                [...sessions]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                    )
                    .slice(
                        0,
                        10
                    );


            activityList.innerHTML =
                latestSessions
                    .map(
                        session => {


                            const time =
                                formatTime(
                                    sessionToSeconds(
                                        session
                                    )
                                );


                            return `
                                <div
                                    class="activity-item-new"
                                >

                                    <!-- آیکون -->

                                    <div
                                        class="activity-icon-new"
                                    >

                                        <i
                                            data-lucide="${
                                                session.icon ||
                                                "book-open"
                                            }"
                                        ></i>

                                    </div>


                                    <!-- اطلاعات -->

                                    <div
                                        class="activity-content-new"
                                    >

                                        <strong>
                                            ${
                                                session.subjectName ||
                                                "بدون نام"
                                            }
                                        </strong>


                                        <span>
                                            ${
                                                session.topic ||
                                                "بدون مبحث"
                                            }
                                        </span>

                                    </div>


                                    <!-- مدت مطالعه -->

                                    <div
                                        class="activity-time-new"
                                    >

                                        ${time}

                                    </div>

                                </div>
                            `;

                        }
                    )
                    .join("");

        }


        /* =================================================
           وضعیت درس‌ها
        ================================================= */

        if (lessonProgressList) {


            const lessonMap =
                new Map();


            /* -------------------------------------------------
               جمع کردن جلسات بر اساس درس
            ------------------------------------------------- */

            sessions.forEach(
                session => {


                    const key =
                        session.subject ||
                        session.subjectName ||
                        "unknown";


                    if (
                        !lessonMap.has(
                            key
                        )
                    ) {


                        lessonMap.set(
                            key,
                            {

                                subject:
                                    session.subject,

                                subjectName:
                                    session.subjectName,

                                icon:
                                    session.icon,

                                color:
                                    session.color,

                                count: 0,

                                seconds: 0

                            }
                        );

                    }


                    const lesson =
                        lessonMap.get(
                            key
                        );


                    lesson.count++;


                    lesson.seconds +=
                        sessionToSeconds(
                            session
                        );

                }
            );


            /* -------------------------------------------------
               ساخت کارت‌های درس
            ------------------------------------------------- */

            lessonProgressList.innerHTML =
                [...lessonMap.values()]
                    .map(
                        lesson => {


                            return `
                                <div
                                    class="lesson-progress-item-new"
                                    data-lesson-key="${
                                        lesson.subject ||
                                        lesson.subjectName ||
                                        "unknown"
                                    }"
                                    style="
                                        --lesson-color: #6366f1;
                                    "
                                >

                                    <!-- آیکون درس -->

                                    <div
                                        class="lesson-progress-icon-new"
                                    >

                                        <i
                                            data-lucide="${
                                                lesson.icon ||
                                                "book-open"
                                            }"
                                        ></i>

                                    </div>


                                    <!-- اطلاعات درس -->

                                    <div
                                        class="lesson-progress-info-new"
                                    >

                                        <strong>
                                            ${
                                                lesson.subjectName ||
                                                "بدون نام"
                                            }
                                        </strong>


                                        <span>
                                            ${
                                                lesson.count
                                            }
                                            جلسه مطالعه
                                        </span>

                                    </div>


                                    <!-- زمان مطالعه -->

                                    <div
                                        class="lesson-progress-time-new"
                                    >

                                        ${
                                            formatTime(
                                                lesson.seconds
                                            )
                                        }

                                    </div>


                                    <!-- سطل زباله -->

                                    <button
                                        type="button"
                                        class="delete-lesson-btn-new"
                                        data-lesson-key="${
                                            lesson.subject ||
                                            lesson.subjectName ||
                                            "unknown"
                                        }"
                                        title="حذف این درس"
                                        aria-label="حذف این درس"
                                    >

                                        <i
                                            data-lucide="trash-2"
                                        ></i>

                                    </button>

                                </div>
                            `;

                        }
                    )
                    .join("");


            /* -------------------------------------------------
               فعال کردن سطل‌های زباله
            ------------------------------------------------- */

            setupLessonDeleteButtons();

        }


        /* =================================================
           ساخت آیکون‌های Lucide
        ================================================= */

        if (
            typeof lucide !==
            "undefined"
        ) {

            lucide.createIcons();

        }


    }
);
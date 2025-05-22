// TODO
/*
    1. 이미지 미리보기 크기 조정
    2. 파일 업로드 실패시 -> 입력된 파일 수 초기화(해결)
    3. 다른 파일 업로드 시 기존에 있던 파일 날리는 초기화 코드 필요
*/

import React, { useState, useRef } from "react";

import UploadImg from '../assets/upload.png';

const Addfile = ({ onFileSelected }) => {
    const [imageSrc, setImageSrc] = useState([]);
    const [fileInfoText, setFileInfoText] = useState("");
    const inputRef = useRef(null);

    const MAX_SIZE_MB = 5;
    const MAX_IMAGE_COUNT = 5;
    const ALLOWED_EXTENSIONS = ['pdf', 'jpeg', 'png', 'jpg'];

    const resetAll = () => {
        inputRef.current.value = null;
        onFileSelected([]); // 부모도 초기화
        setImageSrc([]);
    };

    const checkFile = (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        const extensions = files.map(file =>
            file.name.split('.').pop().toLowerCase()
        );

        const hasInvalidExt = extensions.some(ext => !ALLOWED_EXTENSIONS.includes(ext));
        if (hasInvalidExt) {
            alert('pdf, jpg, jpeg, png 파일만 업로드 가능합니다.');
            resetAll();
            return;
        }

        const isPDF = extensions.every(ext => ext === 'pdf');
        const isImage = extensions.every(ext => ['jpeg', 'jpg', 'png'].includes(ext));
        if (!isPDF && !isImage) {
            alert('PDF는 1개, 이미지는 최대 5개까지 업로드 가능합니다. 혼합 업로드는 불가합니다.');
            resetAll();
            return;
        }

        if (isPDF && files.length > 1) {
            alert('PDF는 1개만 업로드할 수 있습니다.');
            resetAll();
            return;
        }

        if (isImage && files.length > MAX_IMAGE_COUNT) {
            alert(`이미지는 최대 ${MAX_IMAGE_COUNT}개까지 업로드할 수 있습니다.`);
            resetAll();
            return;
        }

        for (let file of files) {
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                alert(`"${file.name}"의 크기가 ${MAX_SIZE_MB}MB를 초과합니다.`);
                resetAll();
                return;
            }
        }

        function shortFilename(name, maxLength = 25){
            if(name.length <= maxLength) return name;

            const dotIndex = name.lastIndexOf('.');
            const ext = name.substring(dotIndex);
            const basename = name.substring(0, dotIndex);

            const start = basename.slice(0,5);
            const end = basename.slice(-5);

            return `${start}...${end}${ext}`;
        }

        if (files.length === 1) {
            const shortName = shortFilename(files[0].name, 20);
            setFileInfoText(`선택된 파일: ${shortName}`);
        } else {
            setFileInfoText(`${files.length}개의 파일이 선택되었습니다.`);
        }

        onFileSelected(files); // 부모에게 전달

        const validPreviews = [];
        files.forEach((file) => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (['jpeg', 'jpg', 'png'].includes(ext)) {
                const reader = new FileReader();
                reader.onload = () => {
                    validPreviews.push(reader.result);
                    setImageSrc([...validPreviews]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    return (
        <div>
            <label htmlFor="add_file"
                className="bg-yellow-02 rounded-[24px] flex items-center justify-center w-[500px] h-[150px] gap-4 px-6 font-bold">
                <img src={UploadImg} alt="upload_img" className="w-[35px] h-[35px]" />
                {fileInfoText.length === 0 ? ('파일 선택(PDF, 이미지)') : (<> <p>{fileInfoText}</p></>)}
            </label>
            <input
                type="file"
                id="add_file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                ref={inputRef}
                onChange={checkFile}
                className="hidden"
            />
        </div>
    );
};

export default Addfile;

/*
-> 입력한 이미지 미리보기 코드임
<div className="flex flex-row">
    {imageSrc.map((src, i) => (
        <img key={i} src={src} alt={`preview-${i}`} className="w-32 h-32 object-cover rounded border my-2" />
    ))}
</div>
*/

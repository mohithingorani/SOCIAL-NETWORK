import Image from "next/image";

export default function StoryPage({
    storyImage
}:{
    storyImage:string
}){
    return <div className="absolute z-50 h-[90%] flex justify-center w-full my-8  ">
        <div className=" bg-gradient-to-t from-[#18181A]  to-[#202020] w-[700px]  border border-white ">
            <div>
                Story
            </div>
            <Image src={storyImage} alt="storyImage" width={"100"} height={"500"}/>
        </div>
    </div>
}
import { MessageObject } from "../therapist/page";

interface TextMessageProps {
  messageObject: MessageObject;
  myId: string;
}

export default function TextMessage2({
  messageObject,
  myId,
}: TextMessageProps) {
  // Check if the message is from the bot or the user
  const isMyMessage = messageObject.id === myId
  const textMessage = messageObject.message;
  const time = messageObject.time;
  return (
    <div>
      {isMyMessage ? (
        <div className="flex flex-col">
          <div className="flex justify-end mt-2">
            <div className="max-w-[45%] w-max bg-[#1A66FF] px-3 py-1.5 rounded-l-xl rounded-tr-xl overflow-wrap break-words">
              <div className="flex flex-col">
                <div className="text-sm lg:text-lg text-white px-2 py-1.5">
                  {textMessage}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs pt-1 text-slate-300 flex justify-end">
              {time}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-start mt-2">
            <div className="max-w-[45%] w-max bg-[#1B1B1B] px-3 py-1.5 rounded-r-xl rounded-tl-xl overflow-wrap break-words">
              <div className="flex flex-col">
                <div className="text-sm lg:text-lg text-white px-2 py-1.5">
                  {textMessage}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs pt-1 text-slate-300 flex justify-start">
              {time}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

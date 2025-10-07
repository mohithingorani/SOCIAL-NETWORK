export interface PostInterface {
  id: number;
  image?: string;
  caption: string;
  Like: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    username: string;
    picture: string;
  };
  _count: {
    likes: number;
    comments:number
  };
  isLikedByUser:boolean
}


export type StoryPreview = undefined |  string

export type StoryFile = undefined | File
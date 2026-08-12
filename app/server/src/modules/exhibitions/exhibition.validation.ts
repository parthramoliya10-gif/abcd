import { z } from "zod";


const exhibitionFields = {
  title: z
    .string()
    .trim()
    .min(1)
    .max(200),

  description: z
    .string()
    .trim()
    .min(1)
    .max(5000),

  venue: z
    .string()
    .trim()
    .min(1)
    .max(200),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  country: z
    .string()
    .trim()
    .max(100)
    .optional(),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  featured: z.boolean().optional(),

  isActive: z.boolean().optional(),
};



export const createExhibitionSchema =
  z.object(exhibitionFields)
  .refine(
    (data)=>data.endDate >= data.startDate,
    {
      message:
      "End date must be greater than start date",

      path:[
        "endDate"
      ],
    }
  );



export const updateExhibitionSchema =
  z.object(exhibitionFields)
  .partial()
  .refine(
    (data)=>{

      if(
        !data.startDate ||
        !data.endDate
      ){
        return true;
      }


      return data.endDate >= data.startDate;

    },
    {
      message:
      "End date must be greater than start date",

      path:[
        "endDate"
      ],
    }
  );



export const searchExhibitionSchema =
z.object({

  keyword:
  z.string()
  .trim()
  .min(1),


  page:
  z.coerce
  .number()
  .int()
  .positive()
  .default(1),


  limit:
  z.coerce
  .number()
  .int()
  .min(1)
  .max(50)
  .default(20),

});



export const exhibitionIdSchema =
z.object({

 id:
 z.string()
 .trim()
 .min(1),

});



export const exhibitionSlugSchema =
z.object({

 slug:
 z.string()
 .trim()
 .min(1),

});



export const imageIdSchema =
z.object({

 imageId:
 z.string()
 .trim()
 .min(1),

});



export const uploadImageSchema =
z.object({

 altText:
 z.string()
 .optional(),


 caption:
 z.string()
 .optional(),

});



export type CreateExhibitionInput =
z.infer<
 typeof createExhibitionSchema
>;


export type UpdateExhibitionInput =
z.infer<
 typeof updateExhibitionSchema
>;
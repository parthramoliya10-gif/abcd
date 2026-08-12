import { InquiryStatus, Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma.js";

interface FindManyParams {
  skip: number;
  take: number;
  search?: string;
  status?: InquiryStatus;
  sortBy?: keyof Prisma.inquiriesOrderByWithRelationInput;
  sortOrder?: Prisma.SortOrder;
}

interface FindAllParams {
  search?: string;
  status?: InquiryStatus;
  sortBy?: keyof Prisma.inquiriesOrderByWithRelationInput;
  sortOrder?: Prisma.SortOrder;
}

class InquiryRepository {
  /**
   * ===========================
   * Private Helpers
   * ===========================
   */

  private buildWhere(
    search?: string,
    status?: InquiryStatus
  ): Prisma.inquiriesWhereInput {
    return {
      deletedAt: null,

      ...(status && { status }),

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            company: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };
  }

  /**
   * ===========================
   * Public
   * ===========================
   */

  create(data: Prisma.inquiriesCreateInput) {
    return prisma.inquiries.create({
      data,
    });
  }

  /**
   * ===========================
   * Admin
   * ===========================
   */

  findById(id: string) {
    return prisma.inquiries.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  findMany({
    skip,
    take,
    search,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  }: FindManyParams) {
    return prisma.inquiries.findMany({
      where: this.buildWhere(search, status),

      orderBy: {
        [sortBy]: sortOrder,
      },

      skip,

      take,
    });
  }

  /**
   * Used for Excel export.
   * Returns all matching inquiries without pagination.
   */
  findAll({
    search,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  }: FindAllParams) {
    return prisma.inquiries.findMany({
      where: this.buildWhere(search, status),

      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  count(search?: string, status?: InquiryStatus) {
    return prisma.inquiries.count({
      where: this.buildWhere(search, status),
    });
  }

  updateStatus(id: string, status: InquiryStatus) {
    return prisma.inquiries.update({
      where: {
        id,
      },

      data: {
        status,
      },
    });
  }

  softDelete(id: string) {
    return prisma.inquiries.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export default new InquiryRepository();
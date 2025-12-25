export class TenantContext {
  private tenantId: number | null = null;

  setTenantId(id: number) {
    this.tenantId = id;
  }

  getTenantId(): number | null {
    return this.tenantId;
  }
}

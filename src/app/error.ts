class ErrorConstructorClass 
{
    public message      : string | undefined = '';
    public messageLength: number | undefined = this.message?.length || 0;
}

export {
    ErrorConstructorClass
}
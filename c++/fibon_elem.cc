#include <iostream>
using namespace std;

bool fibon_elem(int,int &);

int main()
{
    int pos;
    cout<<"enter:";
    cin>>pos;

    int elem;
    if(fibon_elem(pos,elem)){
        cout<<"element # "<<pos
        <<"is"<<elem<<endl;
    }else{
        cout<<"sorry #"<<pos<<endl;
    }
}
